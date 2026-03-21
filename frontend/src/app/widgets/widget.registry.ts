import { Type } from '@angular/core';
import { ChartWidgetComponent } from './chart-widget.component';
import { TextWidgetComponent } from './text-widget.component';
import { TableWidgetComponent } from './table-widget.component';
import { MapWidgetComponent } from '../dashboard-panel/map-widget/map-widget.component';

export interface WidgetRegistryEntry {
  component: Type<unknown>;
  /** Maps the command payload to the component's @Input() bindings. */
  getInputs: (payload: unknown) => Record<string, unknown>;
}

/**
 * Central registry mapping command types to Angular components.
 *
 * To add a new widget type:
 *   1. Create a standalone component in this folder with an `@Input() payload` property.
 *   2. Add one entry here: { component, getInputs }.
 *
 * The dashboard renders all widgets dynamically via NgComponentOutlet —
 * no template changes, no *ngIf blocks, no imports to update in dashboard-panel.
 */
export const WIDGET_REGISTRY: Record<string, WidgetRegistryEntry> = {
  render_chart: {
    component: ChartWidgetComponent,
    getInputs: (payload) => ({ payload }),
  },
  render_text: {
    component: TextWidgetComponent,
    getInputs: (payload) => ({ payload }),
  },
  render_table: {
    component: TableWidgetComponent,
    getInputs: (payload) => ({ payload }),
  },
  render_map: {
    // Payload now contains full data from backend — pass it directly
    component: MapWidgetComponent,
    getInputs: (payload) => ({ payload }),
  },
};
