import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-widget">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th *ngFor="let col of payload.columns">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of payload.rows">
              <td *ngFor="let cell of row">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .table-widget { overflow: hidden; }
    .table-scroll { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: var(--bg); }
    th { padding: 10px 16px; text-align: left; font-weight: 600; font-size: 13px; color: var(--text-muted); border-bottom: 0.5px solid var(--border); }
    td { padding: 10px 16px; font-size: 13px; color: var(--text); border-bottom: 0.5px solid var(--border); }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: var(--bg); }
  `],
})
export class TableWidgetComponent {
  @Input() payload: { columns: string[]; rows: string[][] } = { columns: [], rows: [] };
}
