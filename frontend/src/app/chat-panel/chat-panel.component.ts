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
  @ViewChild('messagesEnd') messagesEnd!: ElementRef<HTMLDivElement>;
  @ViewChild('inputEl') inputEl!: ElementRef<HTMLTextAreaElement>;

  history: ChatMessage[] = [];
  inputText = '';
  isLoading = false;
  latestCommand: DashboardCommand | null = null;

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
    this.scrollToBottom();

    this.chatService
      .send({ message, history: this.history.slice(0, -1) })
      .subscribe({
        next: (response) => {
          this.history.push({ role: 'assistant', content: response.reply });
          this.latestCommand = response.command;
          this.commandChange.emit(response.command);
          this.isLoading = false;
          this.scrollToBottom();
        },
        error: (err) => {
          console.error('Chat error:', err);
          this.history.push({
            role: 'assistant',
            content: 'Sorry, an error occurred. Please try again.',
          });
          this.isLoading = false;
          this.scrollToBottom();
        },
      });
  }

  trackByIndex(index: number): number {
    return index;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }
}
