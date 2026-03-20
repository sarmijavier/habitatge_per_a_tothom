export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type DashboardCommand =
  | { type: 'render_chart'; payload: { label: string; data: number[] } }
  | { type: 'render_text'; payload: { title: string; body: string } }
  | { type: 'render_table'; payload: { columns: string[]; rows: string[][] } }
  | { type: 'clear' };

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  command: DashboardCommand | null;
}
