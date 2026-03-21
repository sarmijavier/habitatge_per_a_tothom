import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-widget">
      <h2 class="widget-title">{{ payload.label }}</h2>
      <svg class="bar-chart"
        [attr.viewBox]="'0 0 ' + (payload.data.length * 60 + 40) + ' 220'"
        preserveAspectRatio="xMidYMid meet">
        <g *ngFor="let value of payload.data; let j = index">
          <rect
            [attr.x]="j * 60 + 20"
            [attr.y]="200 - barHeight(value)"
            width="40"
            [attr.height]="barHeight(value)"
            class="bar"
          />
          <text
            [attr.x]="j * 60 + 40"
            [attr.y]="198 - barHeight(value)"
            text-anchor="middle"
            class="bar-label"
          >{{ value }}</text>
          <text
            [attr.x]="j * 60 + 40"
            y="215"
            text-anchor="middle"
            class="bar-index"
          >{{ j + 1 }}</text>
        </g>
        <line x1="20" y1="200"
          [attr.x2]="payload.data.length * 60 + 20"
          y2="200" class="axis" />
      </svg>
    </div>
  `,
  styles: [`
    .chart-widget { overflow: hidden; padding: 20px; }
    .widget-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: var(--text); }
    .bar-chart { width: 100%; height: auto; overflow: visible; }
    .bar { fill: var(--accent); transition: fill 0.2s; }
    .bar:hover { fill: var(--accent-hover); }
    .bar-label { font-size: 11px; fill: var(--text-muted); }
    .bar-index { font-size: 11px; fill: var(--text-muted); }
    .axis { stroke: var(--border); stroke-width: 1; }
  `],
})
export class ChartWidgetComponent {
  @Input() payload: { label: string; data: number[] } = { label: '', data: [] };

  get max(): number {
    return Math.max(...this.payload.data, 1);
  }

  barHeight(value: number): number {
    return Math.round((value / this.max) * 180);
  }
}
