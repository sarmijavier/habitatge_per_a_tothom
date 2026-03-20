import { Injectable, Logger } from '@nestjs/common';
import { Mistral } from '@mistralai/mistralai';
import {
  ChatMessage,
  ChatResponse,
  DashboardCommand,
} from './chat.types';

const SYSTEM_PROMPT = `You are a dashboard assistant. Your role is to help users visualize data and information on a dashboard.

You MUST always end every response with a CMD line on its own line in exactly this format:
CMD:{"type":"...","payload":{...}}
or if no dashboard action is needed:
CMD:null

Available command types and their payload shapes:
- render_chart: { "label": string, "data": number[] }
  Use when the user asks to draw, plot, show, or visualize numerical/chart data.
- render_text: { "title": string, "body": string }
  Use when the user asks to display text content, summaries, descriptions, or reports.
- render_table: { "columns": string[], "rows": string[][] }
  Use when the user asks to show a table, list with multiple fields, or structured data.
- clear: {} (empty payload)
  Use when the user asks to clear, reset, or empty the dashboard.
- null: use CMD:null when the user asks a general question not related to the dashboard.

Examples:
User: "Draw me a bar chart of monthly sales: 12, 45, 33, 67, 20"
Response: Here is your bar chart of monthly sales.
CMD:{"type":"render_chart","payload":{"label":"Monthly Sales","data":[12,45,33,67,20]}}

User: "Show me a summary of Q3 results"
Response: Here is the Q3 results summary.
CMD:{"type":"render_text","payload":{"title":"Q3 Results Summary","body":"Q3 saw strong performance across all divisions with revenue up 15% year-over-year."}}

User: "Display a table with columns Name, Age, City and two example rows"
Response: Here is your table.
CMD:{"type":"render_table","payload":{"columns":["Name","Age","City"],"rows":[["Alice","30","Barcelona"],["Bob","25","Madrid"]]}}

User: "Clear the dashboard"
Response: Dashboard cleared.
CMD:{"type":"clear","payload":{}}

User: "What is the capital of France?"
Response: The capital of France is Paris.
CMD:null

IMPORTANT: Always respond in the same language the user writes in. Always include the CMD line at the very end.`;

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private client!: Mistral;
  private modelName: string;

  constructor() {
    const apiKey = process.env['MISTRAL_API_KEY'];
    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY environment variable is not set');
    }
    this.client = new Mistral({ apiKey });
    this.modelName = process.env['MISTRAL_MODEL'] ?? 'mistral-small-latest';
    this.logger.log(`Using Mistral model: ${this.modelName}`);
  }

  async chat(message: string, history: ChatMessage[]): Promise<ChatResponse> {
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...history
        .filter((msg) => msg.content && msg.content.trim() !== '')
        .map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      { role: 'user' as const, content: message },
    ];

    const result = await this.client.chat.complete({
      model: this.modelName,
      messages,
    });

    const rawContent = result.choices?.[0]?.message?.content ?? '';
    const rawText = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent);

    const { reply, command } = this.parseResponse(rawText);

    return { reply, command };
  }

  private parseResponse(raw: string): { reply: string; command: DashboardCommand | null } {
    // Match CMD: at the end, possibly with surrounding whitespace/newlines
    const cmdRegex = /\n?\s*CMD:(null|\{.*?\})\s*$/s;
    const match = raw.match(cmdRegex);

    if (!match) {
      return { reply: raw.trim(), command: null };
    }

    const cmdStr = match[1];
    const reply = raw.slice(0, match.index).trim();

    if (cmdStr === 'null') {
      return { reply, command: null };
    }

    try {
      const command = JSON.parse(cmdStr) as DashboardCommand;
      return { reply, command };
    } catch {
      this.logger.warn(`Failed to parse CMD JSON: ${cmdStr}`);
      return { reply, command: null };
    }
  }
}
