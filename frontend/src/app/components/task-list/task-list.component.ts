import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskService, TaskFilters } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { Task, CATEGORY_OPTIONS, ASSIGNED_TO_OPTIONS, PRIORITY_OPTIONS } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TaskCardComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;

  categoryOptions = CATEGORY_OPTIONS;
  assignedToOptions = ASSIGNED_TO_OPTIONS;
  priorityOptions = PRIORITY_OPTIONS;

  filters: TaskFilters = { search: '', category: '', assignedTo: '', priority: '', status: '', sort: 'date_asc' };

  taskToDelete: Task | null = null;
  showDeleteModal = false;

  private searchTimeout: any;

  constructor(private taskService: TaskService, private toast: ToastService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.fetchTasks(), 350);
  }

  fetchTasks(): void {
    this.loading = true;
    this.taskService.getTasks(this.filters).subscribe({
      next: (res) => {
        this.tasks = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.show('Failed to load tasks', 'error');
      }
    });
  }

  clearFilters(): void {
    this.filters = { search: '', category: '', assignedTo: '', priority: '', status: '', sort: 'date_asc' };
    this.fetchTasks();
  }

  onComplete(task: Task): void {
    if (!task._id) return;
    this.taskService.completeTask(task._id).subscribe({
      next: () => {
        this.toast.show(`"${task.taskName}" marked as completed`, 'success');
        this.fetchTasks();
      },
      error: () => this.toast.show('Failed to update task status', 'error')
    });
  }

  confirmDelete(task: Task): void {
    this.taskToDelete = task;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.taskToDelete = null;
    this.showDeleteModal = false;
  }

  proceedDelete(): void {
    if (!this.taskToDelete?._id) return;
    this.taskService.deleteTask(this.taskToDelete._id).subscribe({
      next: () => {
        this.toast.show(`"${this.taskToDelete?.taskName}" deleted`, 'success');
        this.showDeleteModal = false;
        this.taskToDelete = null;
        this.fetchTasks();
      },
      error: () => this.toast.show('Failed to delete task', 'error')
    });
  }
}
