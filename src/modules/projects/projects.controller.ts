import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';

@Controller('projects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProjectsController {
  constructor(private svc: ProjectsService) {}

  @Post()
  @Roles('client', 'admin')
  create(@Body() dto: CreateProjectDto) {
    return this.svc.create(dto);
  }

  @Get('client/:clientId')
  @Roles('client', 'admin')
  byClient(@Param('clientId') clientId: string) {
    return this.svc.findAllByClient(+clientId);
  }

  @Get(':id')
  @Roles('client', 'admin')
  one(@Param('id') id: string) {
    return this.svc.findOne(+id);
  }
}
