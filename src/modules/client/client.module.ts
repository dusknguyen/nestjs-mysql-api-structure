import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientGateway } from './gateway';
import { CommonModule } from '../common';

@Module({
  imports: [TypeOrmModule.forFeature([]), CommonModule],
  providers: [ClientGateway],
  controllers: [],
})
export class ClientModule {}
