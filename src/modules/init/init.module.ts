import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, ConfigEntity, Country, Roles } from 'src/entity';

import { InitService } from './providers';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([User, ConfigEntity, Country, Roles])],
  providers: [InitService],
})
export class InitDbModule {}
