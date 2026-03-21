import { Component, OnInit } from '@angular/core';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { ChatPanelComponent } from './chat-panel/chat-panel.component';
import { DashboardCommand, RenderCommand, WidgetInstance } from './chat.types';
import { WidgetRegistryService } from './services/widget-registry.service';

let idCounter = 0;

/** Auto-layout: 2 columns, 340px wide, 320px row height. */
function autoPosition(widgets: WidgetInstance[]): { x: number; y: number } {
  const col = widgets.length % 2;
  const row = Math.floor(widgets.length / 2);
  return { x: col * 370 + 20, y: row * 340 + 20 };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardPanelComponent, ChatPanelComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  widgets: WidgetInstance[] = [];

  constructor(private widgetRegistry: WidgetRegistryService) {}

  ngOnInit(): void {
    this.widgetRegistry.validateAgainstBackend();
  }

  onCommandChange(command: DashboardCommand | null): void {
    if (!command) return;
    if (command.type === 'clear') {
      this.widgets = [];
      return;
    }
    const { x, y } = autoPosition(this.widgets);
    this.widgets = [
      ...this.widgets,
      { id: `w${++idCounter}`, command: command as RenderCommand, x, y },
    ];
  }

  onWidgetRemoved(id: string): void {
    this.widgets = this.widgets.filter((w) => w.id !== id);
  }
}
