import { Injectable, Logger } from '@nestjs/common';
import { Mistral } from '@mistralai/mistralai';
import { ChatMessage, ChatResponse } from './chat.types';
import { WIDGET_REGISTRY } from './widget.registry';
import { GeoService } from './geo.service';

// ── Router ────────────────────────────────────────────────────────────────────
const ROUTER_PROMPT = `You are a routing assistant for a data dashboard.
Analyze the user's message and decide which dashboard widget best fits the request.

Available types:
- render_chart  — bar chart of numerical values (statistics, comparisons, rankings)
- render_text   — text card with title + body (explanations, summaries, definitions)
- render_table  — table with rows and columns (structured data, lists, multi-column comparisons)
- render_map    — choropleth map of any country by region (any regional/geographic data)
- clear         — user wants to clear / reset the dashboard
- none          — general question, greeting, or anything that doesn't need a widget

Reply with EXACTLY one of these words and nothing else:
render_chart | render_text | render_table | render_map | clear | none`;

// ── Country extractor ─────────────────────────────────────────────────────────
const COUNTRY_EXTRACTOR_PROMPT = `Extract the country name from the user's message.
Reply with ONLY the lowercase English country name, using hyphens for spaces.
Examples: spain, france, czech-republic, united-states, south-korea, south-africa, colombia, brazil, japan.
If no country is mentioned, reply with: spain`;

// ── Plain reply ───────────────────────────────────────────────────────────────
const PLAIN_REPLY_PROMPT = `You are a helpful assistant. Answer the user's question concisely.
Do not include images, external links, or URLs in your response — plain text only.
Always respond in the same language the user writes in.`;

// ── Helpers ───────────────────────────────────────────────────────────────────
type RouteResult = keyof typeof WIDGET_REGISTRY | 'none';
const KNOWN_ROUTES = new Set([...Object.keys(WIDGET_REGISTRY), 'none']);

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private client!: Mistral;
  private modelName: string;

  constructor(private readonly geoService: GeoService) {
    const apiKey = process.env['MISTRAL_API_KEY'];
    if (!apiKey) throw new Error('MISTRAL_API_KEY environment variable is not set');
    this.client = new Mistral({ apiKey });
    this.modelName = process.env['MISTRAL_MODEL'] ?? 'mistral-small-latest';
    this.logger.log(`Using model: ${this.modelName}`);
  }

  async chat(message: string, history: ChatMessage[]): Promise<ChatResponse> {
    this.logger.log(`User: "${message}" (history: ${history.length} msgs)`);

    // ── Step 1: Route ──────────────────────────────────────────────────────────
    const route = await this.route(message, history);
    this.logger.log(`Route → ${route}`);

    // ── Step 2a: No widget needed ──────────────────────────────────────────────
    if (route === 'none') {
      const reply = await this.plainReply(message, history);
      return { reply, command: null };
    }

    // ── Step 2b: Clear — no generation needed ─────────────────────────────────
    if (route === 'clear') {
      return { reply: 'Dashboard cleared.', command: { type: 'clear' } };
    }

    // ── Step 2c: Map — extract country then build prompt with real region names ─
    if (route === 'render_map') {
      return this.generateMap(message, history);
    }

    // ── Step 2d: Other widgets ─────────────────────────────────────────────────
    const def = WIDGET_REGISTRY[route];
    return this.generate(def, message, history);
  }

  // ── Map generation: extract country → fetch GADM names → generate ────────────
  private async generateMap(message: string, history: ChatMessage[]): Promise<ChatResponse> {
    const def = WIDGET_REGISTRY['render_map'];

    // Extract country key from the user message
    const countryKey = await this.extractCountryKey(message);
    this.logger.log(`Map country key: "${countryKey}"`);

    // Fetch the real region names from GADM (cached after first load)
    const regionNames = await this.geoService.getRegionNames(countryKey);
    this.logger.log(`Region names (${regionNames.length}): ${regionNames.slice(0, 5).join(', ')}…`);

    // Build a focused prompt that contains ONLY the exact names for this country
    const dynamicPrompt = regionNames.length
      ? `You are generating a regional map widget for a dashboard.
Your only task is to call the render_map tool with accurate data for ${countryKey}.

Set "country" to exactly: ${countryKey}

The regions for this country are (use these EXACT names, copy character-for-character):
${regionNames.join(', ')}

Rules:
- Use real, accurate data from your knowledge.
- Set a descriptive title and the year the data represents.
- For each region include a label, e.g. "RegionName: value".
- Cover as many regions as you know data for.
You MUST call render_map. Do not write any explanation — just call the tool.
Always respond in the same language the user writes in.`
      : def.generatorPrompt; // fallback to static prompt if GADM fetch failed

    return this.generate({ ...def, generatorPrompt: dynamicPrompt }, message, history);
  }

  // ── Country key extractor ────────────────────────────────────────────────────
  private async extractCountryKey(message: string): Promise<string> {
    const result = await this.client.chat.complete({
      model: this.modelName,
      messages: [
        { role: 'system', content: COUNTRY_EXTRACTOR_PROMPT },
        { role: 'user', content: message },
      ],
    });
    const raw = (result.choices?.[0]?.message?.content ?? '').toString().trim().toLowerCase();
    // Keep only the first word and sanitize
    return raw.split(/\s/)[0].replace(/[^a-z-]/g, '') || 'spain';
  }

  // ── Router call ─────────────────────────────────────────────────────────────
  private async route(message: string, history: ChatMessage[]): Promise<RouteResult> {
    const result = await this.client.chat.complete({
      model: this.modelName,
      messages: [
        { role: 'system', content: ROUTER_PROMPT },
        ...this.formatHistory(history),
        { role: 'user', content: message },
      ],
    });

    const content = result.choices?.[0]?.message?.content ?? '';
    const raw = (typeof content === 'string' ? content : '').trim().toLowerCase();
    const token = raw.split(/\s/)[0].replace(/[^a-z_]/g, '');

    if (KNOWN_ROUTES.has(token)) return token as RouteResult;

    this.logger.warn(`Router returned unexpected value: "${raw}" — falling back to none`);
    return 'none';
  }

  // ── Generator call ───────────────────────────────────────────────────────────
  private async generate(
    def: (typeof WIDGET_REGISTRY)[string],
    message: string,
    history: ChatMessage[],
  ): Promise<ChatResponse> {
    this.logger.log(`Generating widget: ${def.tool.function.name}`);

    const result = await this.client.chat.complete({
      model: this.modelName,
      messages: [
        { role: 'system', content: def.generatorPrompt },
        ...this.formatHistory(history),
        { role: 'user', content: message },
      ],
      tools: [def.tool],
      toolChoice: 'any',
    });

    const assistantMsg = result.choices?.[0]?.message;
    const toolCall = assistantMsg?.toolCalls?.[0];

    if (!toolCall) {
      this.logger.warn(`Generator for ${def.tool.function.name} returned no tool call — falling back to plain reply`);
      const reply = await this.plainReply(message, history);
      return { reply, command: null };
    }

    const args = JSON.parse(toolCall.function.arguments as string) as Record<string, unknown>;
    this.logger.log(`Tool args keys: ${Object.keys(args).join(', ')}`);

    return { reply: def.reply, command: def.build(args) };
  }

  // ── Plain conversational reply ───────────────────────────────────────────────
  private async plainReply(message: string, history: ChatMessage[]): Promise<string> {
    const result = await this.client.chat.complete({
      model: this.modelName,
      messages: [
        { role: 'system', content: PLAIN_REPLY_PROMPT },
        ...this.formatHistory(history),
        { role: 'user', content: message },
      ],
    });
    return (result.choices?.[0]?.message?.content ?? '').toString().trim();
  }

  private formatHistory(history: ChatMessage[]) {
    return history
      .filter((m) => m.content?.trim())
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  }
}
