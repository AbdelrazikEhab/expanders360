import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AnalyticsController {
  constructor(private svc: AnalyticsService) {}

  @Get('top-vendors')
  @Roles('admin')
  topVendors() {
    return this.svc.topVendorsWithDocCounts();
  }
}
