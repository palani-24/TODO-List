import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import {
  CATEGORY_OPTIONS,
  ASSIGNED_TO_OPTIONS,
  PRIORITY_OPTIONS
} from '../../models/task.model';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {

  categoryOptions = CATEGORY_OPTIONS;
  assignedToOptions = ASSIGNED_TO_OPTIONS;
  priorityOptions = PRIORITY_OPTIONS;
  submitting = false;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private toast: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      taskName: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      assignedTo: ['', Validators.required],
      priority: ['Medium', Validators.required],
      practiceDate: ['', Validators.required],
      status: ['Pending', Validators.required],
      description: ['']
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.taskService.createTask(this.form.value).subscribe({
      next: () => {
        this.toast.show('Task created successfully', 'success');
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.submitting = false;
        this.toast.show(
          err?.error?.message || 'Failed to create task',
          'error'
        );
      }
    });
  }
}