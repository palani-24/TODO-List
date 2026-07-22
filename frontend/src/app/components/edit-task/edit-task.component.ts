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
import { PlayerService } from '../../services/player.service';
import { ToastService } from '../../services/toast.service';
import { Player } from '../../models/player.model';
import {
  CATEGORY_OPTIONS,
  ASSIGNED_TO_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS
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
  statusOptions = STATUS_OPTIONS;

  players: Player[] = [];
  submitting = false;
  loading = true;
  taskId = '';

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private playerService: PlayerService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      taskName: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      assignedTo: ['', Validators.required],
      player: [''],
      priority: ['Medium', Validators.required],
      practiceDate: ['', Validators.required],
      status: ['Pending', Validators.required],
      tagsInput: [''],
      description: ['']
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';

    // Load active players
    this.playerService.getPlayers({ isActive: true }).subscribe({
      next: (res) => {
        if (res.success) this.players = res.data;
      }
    });

    // Load task
    this.taskService.getTask(this.taskId).subscribe({
      next: (res) => {
        const task = res.data;

        const playerId = typeof task.player === 'object' && task.player ? task.player._id : (task.player || '');
        const tagsJoined = task.tags ? task.tags.join(', ') : '';

        this.form.patchValue({
          taskName: task.taskName,
          category: task.category,
          assignedTo: task.assignedTo,
          player: playerId,
          priority: task.priority,
          practiceDate: task.practiceDate ? task.practiceDate.substring(0, 10) : '',
          status: task.status,
          tagsInput: tagsJoined,
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

    const val = this.form.value;
    const tagsArray = val.tagsInput
      ? val.tagsInput.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
      : [];

    const payload = {
      taskName: val.taskName,
      category: val.category,
      assignedTo: val.assignedTo,
      player: val.player || null,
      priority: val.priority,
      practiceDate: val.practiceDate,
      status: val.status,
      tags: tagsArray,
      description: val.description
    };

    this.taskService.updateTask(this.taskId, payload as any).subscribe({
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