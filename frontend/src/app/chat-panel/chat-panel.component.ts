import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { ChatMessage, DashboardCommand } from '../chat.types';

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css'],
})
export class ChatPanelComponent {
  @Output() commandChange = new EventEmitter<DashboardCommand | null>();
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('messagesEnd') messagesEnd!: ElementRef<HTMLDivElement>;

  history: ChatMessage[] = [];
  inputText = '';
  isLoading = false;

  constructor(private chatService: ChatService) {}

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  submit(): void {
    const message = this.inputText.trim();
    if (!message || this.isLoading) return;

    this.history.push({ role: 'user', content: message });
    this.inputText = '';
    this.isLoading = true;
    // Always scroll on send — user just sent something, show the loading indicator
    this.scrollToBottom(true);

    this.chatService
      .send({ message, history: this.history.slice(0, -1) })
      .subscribe({
        next: (response) => {
          this.history.push({ role: 'assistant', content: response.reply });
          this.commandChange.emit(response.command);
          this.isLoading = false;
          // Scroll only if user is already near the bottom (not reading history)
          this.scrollToBottom(false);
        },
        error: (err) => {
          console.error('Chat error:', err);
          this.history.push({
            role: 'assistant',
            content: 'Sorry, an error occurred. Please try again.',
          });
          this.isLoading = false;
          this.scrollToBottom(false);
        },
      });
  }

  trackByIndex(index: number): number {
    return index;
  }

  /**
   * @param force - if true, always scroll (used on message send);
   *                if false, scroll only when user is near the bottom.
   */
  private scrollToBottom(force: boolean): void {
    setTimeout(() => {
      const container = this.messagesContainer?.nativeElement;
      if (!container) return;

      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      const isNearBottom = distanceFromBottom < 120;

      if (force || isNearBottom) {
        this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  }
}
