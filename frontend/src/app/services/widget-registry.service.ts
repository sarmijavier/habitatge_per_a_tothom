import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WIDGET_REGISTRY } from '../widgets/widget.registry';

export interface WidgetMeta {
  type: string;
  description: string;
  parameters: Record<string, unknown>;
}

/**
 * Fetches the authoritative widget list from the backend.
 *
 * Used at startup to warn developers when the backend has registered a new widget
 * type that the frontend doesn't have a component for yet — the only remaining
 * "add in two places" step.
 */
@Injectable({ providedIn: 'root' })
export class WidgetRegistryService {
  private readonly widgetsUrl = 'http://localhost:3000/chat/widgets';

  constructor(private http: HttpClient) {}

  async validateAgainstBackend(): Promise<void> {
    try {
      const { widgets } = await firstValueFrom(
        this.http.get<{ widgets: WidgetMeta[] }>(this.widgetsUrl),
      );
      const missing = widgets
        .map((w) => w.type)
        .filter((type) => !WIDGET_REGISTRY[type]);

      if (missing.length > 0) {
        console.warn(
          `[WidgetRegistry] Backend has widget types with no frontend component:\n` +
            missing.map((t) => `  • ${t}`).join('\n') +
            `\nCreate a component and add it to src/app/widgets/widget.registry.ts`,
        );
      }
    } catch {
      // Backend unavailable during dev — not fatal
    }
  }
}
