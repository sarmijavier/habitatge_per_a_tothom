import { Component } from '@angular/core';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { ChatPanelComponent } from './chat-panel/chat-panel.component';
import { DashboardCommand } from './chat.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardPanelComponent, ChatPanelComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  commands: DashboardCommand[] = [];

  onCommandChange(command: DashboardCommand | null): void {
    if (!command) return;
    if (command.type === 'clear') {
      this.commands = [];
    } else {
      this.commands = [...this.commands, command];
    }
  }
}
