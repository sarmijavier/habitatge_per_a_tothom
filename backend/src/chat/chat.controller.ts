import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequest, ChatResponse } from './chat.types';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: ChatRequest): Promise<ChatResponse> {
    return this.chatService.chat(body.message, body.history ?? []);
  }
}
