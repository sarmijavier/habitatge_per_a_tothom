import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCommand } from '../chat.types';

@Component({
  selector: 'app-dashboard-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css'],
})
export class DashboardPanelComponent {
  @Input() commands: DashboardCommand[] = [];

  chartMax(command: DashboardCommand): number {
    if (command.type === 'render_chart') {
      return Math.max(...command.payload.data, 1);
    }
    return 1;
  }

  barHeight(value: number, command: DashboardCommand): number {
    const max = this.chartMax(command);
    return Math.round((value / max) * 180);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
