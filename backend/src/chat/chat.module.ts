import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';

@Module({
  controllers: [ChatController, GeoController],
  providers: [ChatService, GeoService],
})
export class ChatModule {}
