import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { Task } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-completed-task',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './completed-task.component.html',
  styleUrls: ['./completed-task.component.scss']
})
export class CompletedTaskComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  taskToDelete: Task | null = null;
  showDeleteModal = false;

  constructor(private taskService: TaskService, private toast: ToastService) {}

  ngOnInit(): void {
    this.fetchCompleted();
  }

  fetchCompleted(): void {
    this.loading = true;
    this.taskService.getTasks({ status: 'Completed', sort: 'date_desc' }).subscribe({
      next: (res) => {
        this.tasks = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.show('Failed to load completed tasks', 'error');
      }
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
        this.toast.show('Task deleted', 'success');
        this.showDeleteModal = false;
        this.fetchCompleted();
      },
      error: () => this.toast.show('Failed to delete task', 'error')
    });
  }

  noop(): void {}
}
