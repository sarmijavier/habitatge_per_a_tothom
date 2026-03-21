export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * A command from the backend telling the dashboard what to render.
 *
 * Intentionally generic — adding new widget types on the backend never requires
 * touching this file. Each widget component is responsible for typing its own payload.
 */
export type DashboardCommand =
  | { type: 'clear' }
  | { type: string; payload: Record<string, unknown> };

/** Any command that results in a rendered widget (everything except 'clear'). */
export type RenderCommand = { type: string; payload: Record<string, unknown> };

/** A widget placed on the dashboard canvas with its position. */
export interface WidgetInstance {
  id: string;
  command: RenderCommand;
  x: number;
  y: number;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  command: DashboardCommand | null;
}
