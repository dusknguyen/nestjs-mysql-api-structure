import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entity';

import { MessageGateway } from './gateway';
import { MessageService } from './services';
import { CommonModule } from '../common';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), CommonModule],
  providers: [MessageService, MessageGateway],
  controllers: [],
})
export class MessageModule {}
