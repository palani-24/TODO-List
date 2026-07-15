import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Task } from '../../models/task.model';

const CATEGORY_ICONS: Record<string, string> = {
  'Batting Practice': 'fa-solid fa-baseball-bat-ball',
  'Bowling Practice': 'fa-solid fa-circle-dot',
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
  imports: [CommonModule, RouterLink],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() complete = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();

  get icon(): string {
    return CATEGORY_ICONS[this.task.category] || 'fa-solid fa-clipboard';
  }

  priorityClass(): string {
    return { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' }[this.task.priority] || '';
  }

  statusClass(): string {
    return this.task.status === 'Completed' ? 'badge-completed' : 'badge-pending';
  }
}
