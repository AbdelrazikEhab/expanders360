import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';

@Controller('documents')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DocumentsController {
  constructor(private svc: DocumentsService) {}

  @Post()
  @Roles('admin', 'client')
  create(@Body() body: { projectId: number; title: string; content: string; tags?: string[] }) {
    return this.svc.create(body);
  }

  @Get('search')
  @Roles('admin', 'client')
  search(@Query() q: any) {
    return this.svc.search(q);
  }
}
