import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { CompletedTaskComponent } from './components/completed-task/completed-task.component';
import { ReportsComponent } from './components/reports/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | CTTMS' },
  { path: 'tasks', component: TaskListComponent, title: 'Team Tasks | CTTMS' },
  { path: 'tasks/add', component: AddTaskComponent, title: 'Add Task | CTTMS' },
  { path: 'tasks/edit/:id', component: EditTaskComponent, title: 'Edit Task | CTTMS' },
  { path: 'completed', component: CompletedTaskComponent, title: 'Completed Tasks | CTTMS' },
  { path: 'reports', component: ReportsComponent, title: 'Reports | CTTMS' },
  { path: '**', redirectTo: 'dashboard' }
];
