export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export type DashboardCommand =
  | { type: 'render_chart'; payload: { label: string; data: number[] } }
  | { type: 'render_text'; payload: { title: string; body: string } }
  | { type: 'render_table'; payload: { columns: string[]; rows: string[][] } }
  | {
      type: 'render_map';
      payload: {
        country: string;  // e.g. "spain", "france", "germany" — drives GeoJSON selection
        title?: string;
        year?: number;
        regions: Array<{ name: string; value: number; label?: string }>;
      };
    }
  | { type: 'clear' };

export interface ChatResponse {
  reply: string;
  command: DashboardCommand | null;
}
