import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Type,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { RenderCommand, WidgetInstance } from '../chat.types';
import { WIDGET_REGISTRY } from '../widgets/widget.registry';

interface DragState {
  widgetId: string;
  startMouseX: number;
  startMouseY: number;
  origX: number;
  origY: number;
}

@Component({
  selector: 'app-dashboard-panel',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css'],
})
export class DashboardPanelComponent {
  @Input() widgets: WidgetInstance[] = [];
  @Output() widgetRemoved = new EventEmitter<string>();

  private dragState: DragState | null = null;
  isDragging = false;
  debugWidgetId: string | null = null;

  getComponent(type: string): Type<unknown> | null {
    return WIDGET_REGISTRY[type]?.component ?? null;
  }

  getInputs(command: RenderCommand): Record<string, unknown> {
    return WIDGET_REGISTRY[command.type]?.getInputs(command.payload) ?? {};
  }

  onDragStart(event: MouseEvent, widget: WidgetInstance): void {
    event.preventDefault();
    this.isDragging = true;
    this.dragState = {
      widgetId: widget.id,
      startMouseX: event.clientX,
      startMouseY: event.clientY,
      origX: widget.x,
      origY: widget.y,
    };
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (!this.dragState) return;
    const widget = this.widgets.find((w) => w.id === this.dragState!.widgetId);
    if (!widget) return;
    widget.x = Math.max(0, this.dragState.origX + event.clientX - this.dragState.startMouseX);
    widget.y = Math.max(0, this.dragState.origY + event.clientY - this.dragState.startMouseY);
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    this.dragState = null;
    this.isDragging = false;
  }

  toggleDebug(id: string): void {
    this.debugWidgetId = this.debugWidgetId === id ? null : id;
  }

  formatPayload(command: RenderCommand): string {
    const p = command.payload;
    // For map: show summary instead of all 300+ region points
    if (command.type === 'render_map' && Array.isArray((p as any)['regions'])) {
      const { regions, ...rest } = p as any;
      const summary = {
        ...rest,
        regions: `[${regions.length} data points — ${rest['availableYears']?.length ?? '?'} years × ${Math.round(regions.length / (rest['availableYears']?.length ?? 1))} regions]`,
      };
      return JSON.stringify(summary, null, 2);
    }
    return JSON.stringify(p, null, 2);
  }

  removeWidget(id: string): void {
    this.widgetRemoved.emit(id);
  }

  trackById(_index: number, widget: WidgetInstance): string {
    return widget.id;
  }
}
