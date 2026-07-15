import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import {
  CATEGORY_OPTIONS,
  ASSIGNED_TO_OPTIONS,
  PRIORITY_OPTIONS
} from '../../models/task.model';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  categoryOptions = CATEGORY_OPTIONS;
  assignedToOptions = ASSIGNED_TO_OPTIONS;
  priorityOptions = PRIORITY_OPTIONS;

  submitting = false;
  loading = true;
  taskId = '';

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
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

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';

    this.taskService.getTask(this.taskId).subscribe({
      next: (res) => {
        const task = res.data;

        this.form.patchValue({
          taskName: task.taskName,
          category: task.category,
          assignedTo: task.assignedTo,
          priority: task.priority,
          practiceDate: task.practiceDate
            ? task.practiceDate.substring(0, 10)
            : '',
          status: task.status,
          description: task.description
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.show('Task not found', 'error');
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.taskService.updateTask(this.taskId, this.form.value).subscribe({
      next: () => {
        this.toast.show('Task updated successfully', 'success');
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.submitting = false;
        this.toast.show(
          err?.error?.message || 'Failed to update task',
          'error'
        );
      }
    });
  }
}