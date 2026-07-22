import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';

const CATEGORY_ICONS: Record<string, string> = {
  'Batting Practice': 'fa-solid fa-baseball-bat-ball',
  'Bowling Practice': 'fa-solid fa-bowling-ball',
  'Fielding Practice': 'fa-solid fa-hand',
  'Fitness Training': 'fa-solid fa-dumbbell',
  'Match Strategy': 'fa-solid fa-chess',
  'Warm-up': 'fa-solid fa-person-running',
  'Recovery': 'fa-solid fa-heart-pulse',
  'Team Meeting': 'fa-solid fa-people-group',
  'Video Analysis': 'fa-solid fa-video',
  'Travel': 'fa-solid fa-bus',
  'Equipment Check': 'fa-solid fa-bag-shopping'
};

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() complete = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<void>();

  showNotesModal = false;
  newNoteText = '';
  addingNote = false;

  constructor(
    private taskService: TaskService,
    private toast: ToastService
  ) {}

  get icon(): string {
    return CATEGORY_ICONS[this.task.category] || 'fa-solid fa-clipboard';
  }

  priorityClass(): string {
    return { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' }[this.task.priority] || '';
  }

  statusClass(): string {
    if (this.task.status === 'Completed') return 'badge-completed';
    if (this.task.status === 'In Progress') return 'badge-progress';
    return 'badge-pending';
  }

  get assignedPlayerName(): string | null {
    if (typeof this.task.player === 'object' && this.task.player) {
      return `#${this.task.player.jerseyNumber} ${this.task.player.name}`;
    }
    return null;
  }

  changeStatus(status: 'Pending' | 'In Progress' | 'Completed'): void {
    if (!this.task._id) return;
    this.taskService.updateStatus(this.task._id, status).subscribe({
      next: (res) => {
        if (res.success) {
          this.task.status = status;
          this.toast.show(`Status updated to ${status}`, 'success');
          this.taskUpdated.emit();
        }
      }
    });
  }

  toggleNotesModal(event: Event): void {
    event.stopPropagation();
    this.showNotesModal = !this.showNotesModal;
  }

  addNote(): void {
    if (!this.newNoteText.trim() || !this.task._id) return;
    this.addingNote = true;
    this.taskService.addNote(this.task._id, { text: this.newNoteText.trim(), author: 'Coach' }).subscribe({
      next: (res) => {
        if (res.success) {
          this.task.notes = res.data.notes;
          this.newNoteText = '';
          this.toast.show('Note added', 'success');
        }
        this.addingNote = false;
      },
      error: () => {
        this.addingNote = false;
        this.toast.show('Failed to add note', 'danger');
      }
    });
  }

  deleteNote(noteId: string): void {
    if (!this.task._id || !noteId) return;
    this.taskService.deleteNote(this.task._id, noteId).subscribe({
      next: (res) => {
        if (res.success) {
          this.task.notes = res.data.notes;
          this.toast.show('Note removed', 'info');
        }
      }
    });
  }
}
