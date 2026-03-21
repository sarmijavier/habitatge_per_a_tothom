import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-widget',
  standalone: true,
  imports: [],
  template: `
    <div class="text-widget">
      <h2 class="widget-title">{{ payload.title }}</h2>
      <p class="widget-body">{{ payload.body }}</p>
    </div>
  `,
  styles: [`
    .text-widget { padding: 24px; }
    .widget-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: var(--text); }
    .widget-body { color: var(--text-muted); font-size: 14px; line-height: 1.7; }
  `],
})
export class TextWidgetComponent {
  @Input() payload: { title: string; body: string } = { title: '', body: '' };
}
