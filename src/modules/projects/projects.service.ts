import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { Client } from '../clients/client.entity';
import { CreateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projects: Repository<Project>,
    @InjectRepository(Client) private clients: Repository<Client>,
  ) {}

  async create(dto: CreateProjectDto) {
    const client = await this.clients.findOne({ where: { id: dto.clientId } });
    if (!client) throw new NotFoundException('Client not found');
    const project = this.projects.create({
      client,
      country: dto.country,
      services_needed: dto.services_needed,
      budget: dto.budget,
      status: 'active',
    });
    return this.projects.save(project);
  }

  findAllByClient(clientId: number) {
    return this.projects.find({ where: { client: { id: clientId } } });
  }

  async findOne(id: number) {
    const p = await this.projects.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Project not found');
    return p;
  }
}
