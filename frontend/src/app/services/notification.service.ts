import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { NotificationItem, NotificationResponse } from '../models/notification.model';
import { ApiResponse } from './task.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  private notificationsSubject = new BehaviorSubject<NotificationItem[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchNotifications(unreadOnly = false): Observable<NotificationResponse> {
    let params = new HttpParams();
    if (unreadOnly) params = params.set('unreadOnly', 'true');

    return this.http.get<NotificationResponse>(this.apiUrl, { params }).pipe(
      tap(res => {
        if (res.success) {
          this.notificationsSubject.next(res.data);
          this.unreadCountSubject.next(res.unreadCount);
        }
      })
    );
  }

  markRead(id: string): Observable<ApiResponse<NotificationItem>> {
    return this.http.patch<ApiResponse<NotificationItem>>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => this.fetchNotifications().subscribe())
    );
  }

  markAllRead(): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => this.fetchNotifications().subscribe())
    );
  }

  deleteNotification(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.fetchNotifications().subscribe())
    );
  }

  clearAll(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(this.apiUrl).pipe(
      tap(() => {
        this.notificationsSubject.next([]);
        this.unreadCountSubject.next(0);
      })
    );
  }
}
