import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task, CATEGORY_OPTIONS } from '../../models/task.model';

interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  breakdown: CategoryBreakdown[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks({}).subscribe({
      next: (res) => {
        this.tasks = res.data;
        this.buildBreakdown();
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  buildBreakdown(): void {
    const total = this.tasks.length || 1;
    const counts: Record<string, number> = {};
    CATEGORY_OPTIONS.forEach(c => (counts[c] = 0));
    this.tasks.forEach(t => (counts[t.category] = (counts[t.category] || 0) + 1));

    this.breakdown = Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }

  get completionRate(): number {
    if (this.tasks.length === 0) return 0;
    const completed = this.tasks.filter(t => t.status === 'Completed').length;
    return Math.round((completed / this.tasks.length) * 100);
  }
}
