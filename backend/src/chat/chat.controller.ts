import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequest, ChatResponse } from './chat.types';
import { WIDGET_REGISTRY } from './widget.registry';

export interface WidgetMeta {
  type: string;
  description: string;
  parameters: Record<string, unknown>;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: ChatRequest): Promise<ChatResponse> {
    return this.chatService.chat(body.message, body.history ?? []);
  }

  /**
   * Returns metadata for every registered dashboard widget.
   * The frontend uses this to know which widget types exist and what their
   * payload schema looks like — no need to duplicate type definitions.
   */
  @Get('widgets')
  getWidgets(): { widgets: WidgetMeta[] } {
    const widgets = Object.entries(WIDGET_REGISTRY)
      .filter(([type]) => type !== 'clear')
      .map(([type, def]) => ({
        type,
        description: def.tool.function.description,
        parameters: def.tool.function.parameters as Record<string, unknown>,
      }));
    return { widgets };
  }
}
