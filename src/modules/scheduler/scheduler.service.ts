import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProjectsService } from '../projects/projects.service';
import { MatchesService } from '../matches/matches.service';
import { VendorsService } from '../vendors/vendors.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    private projects: ProjectsService,
    private matches: MatchesService,
    private vendors: VendorsService,
  ) {}

  // Run daily at 03:00
  @Cron('0 3 * * *')
  async dailyRefresh() {
    this.logger.log('Daily refresh: rebuilding matches for active projects and flagging expired SLAs');
    const active = await this.projects['projects'].find({ where: { status: 'active' } });
    for (const p of active) {
      await this.matches.rebuildForProject(p.id);
    }
    await this.vendors.flagExpired();
  }
}
