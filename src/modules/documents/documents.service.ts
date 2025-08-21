import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchDocument } from './document.schema';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(ResearchDocument.name) private docModel: Model<ResearchDocument>,
    private projects: ProjectsService,
  ) {}

  create(body: { projectId: number; title: string; content: string; tags?: string[] }) {
    return this.docModel.create({ ...body, tags: body.tags ?? [] });
  }

  search(q: { tag?: string; text?: string; projectId?: number }) {
    const cond: any = {};
    if (q.projectId) cond.projectId = q.projectId;
    const and: any[] = [];
    if (q.tag) and.push({ tags: q.tag });
    if (q.text) and.push({ $text: { $search: q.text } });
    if (and.length) cond.$and = and;
    return this.docModel.find(cond).exec();
  }

  // count docs linked to expansion projects in a specific country
  async countDocsByCountry(country: string) {
    const projects = await this.projects['projects'].find({ where: { country } });
    const ids = projects.map((p: any) => p.id);
    if (ids.length === 0) return 0;
    return this.docModel.countDocuments({ projectId: { $in: ids } }).exec();
  }
}
