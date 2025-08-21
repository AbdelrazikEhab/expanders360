import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MatchesController {
  constructor(private svc: MatchesService) {}

  @Post('projects/:id/matches/rebuild')
  @Roles('admin', 'client')
  rebuild(@Param('id') id: string) {
    return this.svc.rebuildForProject(+id);
  }
}
