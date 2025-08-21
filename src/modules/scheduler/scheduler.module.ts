import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ProjectsModule } from '../projects/projects.module';
import { MatchesModule } from '../matches/matches.module';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [ProjectsModule, MatchesModule, VendorsModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
