import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { Vendor } from '../vendors/vendor.entity';
import { Project } from '../projects/project.entity';
import { NotificationsService } from '../notifications/notifications.service';

function intersect(a: string[], b: string[]) {
  const bs = new Set(b);
  return a.filter(x => bs.has(x));
}

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match) private matches: Repository<Match>,
    @InjectRepository(Vendor) private vendors: Repository<Vendor>,
    @InjectRepository(Project) private projects: Repository<Project>,
    private notify: NotificationsService,
  ) {}

  private scoreFor(overlapCount: number, rating: number, slaHours: number) {
    const SLA_weight = slaHours <= 24 ? 3 : slaHours <= 72 ? 1 : 0;
    return overlapCount * 2 + (rating || 0) + SLA_weight;
  }

  async rebuildForProject(projectId: number) {
    const project = await this.projects.findOne({ where: { id: projectId } });
    if (!project) throw new Error('Project not found');

    const candidateVendors = await this.vendors
      .createQueryBuilder('v')
      .where(':country MEMBER OF (v.countries_supported)', { country: project.country })
      .orWhere("JSON_CONTAINS(JSON_EXTRACT(v.countries_supported, '$'), JSON_QUOTE(:country))", { country: project.country })
      .getMany();

    const results: Match[] = [];
    for (const v of candidateVendors) {
      const overlap = intersect(project.services_needed, v.services_offered);
      if (overlap.length < 1) continue;
      const score = this.scoreFor(overlap.length, v.rating, v.response_sla_hours);

      // upsert: unique on (project, vendor)
      let m = await this.matches.findOne({ where: { project: { id: project.id }, vendor: { id: v.id } } });
      if (!m) {
        m = this.matches.create({ project, vendor: v, score });
        m = await this.matches.save(m);
        await this.notify.onNewMatch(project, v, score);
      } else {
        m.score = score;
        m = await this.matches.save(m);
      }
      results.push(m as any);
    }
    return results;
  }

  async topVendorsAvgScoreLast30Days() {
    // avg score per vendor,country in last 30 days
    const qb = this.matches.createQueryBuilder('m')
      .leftJoin('m.vendor', 'v')
      .leftJoin('m.project', 'p')
      .where('m.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)')
      .select('p.country', 'country')
      .addSelect('v.id', 'vendorId')
      .addSelect('v.name', 'vendorName')
      .addSelect('AVG(m.score)', 'avgScore')
      .groupBy('p.country, v.id, v.name');

    const rows = await qb.getRawMany();
    // group by country with top 3
    const map: Record<string, any[]> = {};
    for (const r of rows) {
      map[r.country] = map[r.country] || [];
      map[r.country].push({ vendorId: +r.vendorId, vendorName: r.vendorName, avgScore: +r.avgScore });
    }
    for (const c of Object.keys(map)) {
      map[c].sort((a,b)=> b.avgScore - a.avgScore);
      map[c] = map[c].slice(0,3);
    }
    return map;
  }
}
