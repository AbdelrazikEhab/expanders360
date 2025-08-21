import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { VendorsModule } from './vendors/vendors.module';
import { MatchesModule } from './matches/matches.module';
import { DocumentsModule } from './documents/documents.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql',
        host: process.env.MYSQL_HOST || 'localhost',
        port: +(process.env.MYSQL_PORT || 3306),
        username: process.env.MYSQL_USER || 'root',
        database: process.env.MYSQL_DB || 'expanders360',
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: true,
      })
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/expanders360',{ autoCreate: true}),
    ScheduleModule.forRoot(),
    AuthModule,
    ClientsModule,
    ProjectsModule,
    VendorsModule,
    MatchesModule,
    DocumentsModule,
    AnalyticsModule,
    NotificationsModule,
    SchedulerModule,
    
  ]
  
})
export class AppModule {}
