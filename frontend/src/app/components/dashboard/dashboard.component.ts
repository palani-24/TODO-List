import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { Task, TaskStats } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: TaskStats = { total: 0, pending: 0, completed: 0, highPriority: 0 };
  recentTasks: Task[] = [];
  loading = true;

  constructor(private taskService: TaskService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentTasks();
  }

  loadStats(): void {
    this.taskService.getStats().subscribe({
      next: (res) => (this.stats = res.data),
      error: () => this.toast.show('Failed to load dashboard stats', 'error')
    });
  }

  loadRecentTasks(): void {
    this.loading = true;
    this.taskService.getTasks({ sort: 'newest' }).subscribe({
      next: (res) => {
        this.recentTasks = res.data.slice(0, 6);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.show('Failed to load tasks', 'error');
      }
    });
  }

  priorityClass(priority: string): string {
    return {
      High: 'badge-high',
      Medium: 'badge-medium',
      Low: 'badge-low'
    }[priority] || '';
  }

  statusClass(status: string): string {
    return status === 'Completed' ? 'badge-completed' : 'badge-pending';
  }
}
