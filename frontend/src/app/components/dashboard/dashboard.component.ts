import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { MatchService } from '../../services/match.service';
import { PlayerService } from '../../services/player.service';
import { ToastService } from '../../services/toast.service';
import { Task, TaskStats } from '../../models/task.model';
import { Match } from '../../models/match.model';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: TaskStats = { total: 0, pending: 0, completed: 0, highPriority: 0, overdue: 0 };
  recentTasks: Task[] = [];
  upcomingMatches: Match[] = [];
  squadSummary: Player[] = [];
  loading = true;

  constructor(
    private taskService: TaskService,
    private matchService: MatchService,
    private playerService: PlayerService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentTasks();
    this.loadUpcomingMatches();
    this.loadSquad();
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

  loadUpcomingMatches(): void {
    this.matchService.getUpcomingMatches().subscribe({
      next: (res) => {
        if (res.success) {
          this.upcomingMatches = res.data.slice(0, 3);
        }
      }
    });
  }

  loadSquad(): void {
    this.playerService.getPlayers({ isActive: true }).subscribe({
      next: (res) => {
        if (res.success) {
          this.squadSummary = res.data.slice(0, 5);
        }
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
    if (status === 'Completed') return 'badge-completed';
    if (status === 'In Progress') return 'badge-progress';
    return 'badge-pending';
  }
}
