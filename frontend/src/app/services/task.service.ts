import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStats } from '../models/task.model';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

export interface TaskFilters {
  search?: string;
  category?: string;
  assignedTo?: string;
  priority?: string;
  status?: string;
  sort?: string;
  tag?: string;
  overdue?: boolean | string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(filters: TaskFilters = {}): Observable<ApiResponse<Task[]>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<Task[]>>(this.apiUrl, { params });
  }

  getTask(id: string): Observable<ApiResponse<Task>> {
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<ApiResponse<Task>> {
    return this.http.post<ApiResponse<Task>>(this.apiUrl, task);
  }

  updateTask(id: string, task: Task): Observable<ApiResponse<Task>> {
    return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<ApiResponse<Task>> {
    return this.http.delete<ApiResponse<Task>>(`${this.apiUrl}/${id}`);
  }

  completeTask(id: string): Observable<ApiResponse<Task>> {
    return this.http.patch<ApiResponse<Task>>(`${this.apiUrl}/${id}/complete`, {});
  }

  updateStatus(id: string, status: string): Observable<ApiResponse<Task>> {
    return this.http.patch<ApiResponse<Task>>(`${this.apiUrl}/${id}/status`, { status });
  }

  addNote(taskId: string, note: { text: string; author?: string }): Observable<ApiResponse<Task>> {
    return this.http.post<ApiResponse<Task>>(`${this.apiUrl}/${taskId}/notes`, note);
  }

  deleteNote(taskId: string, noteId: string): Observable<ApiResponse<Task>> {
    return this.http.delete<ApiResponse<Task>>(`${this.apiUrl}/${taskId}/notes/${noteId}`);
  }

  getStats(): Observable<ApiResponse<TaskStats>> {
    return this.http.get<ApiResponse<TaskStats>>(`${this.apiUrl}/stats/summary`);
  }

  getAllTags(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/tags/all`);
  }
}
