import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { NotificationItem } from '../../models/notification.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isCollapsed = false;
  showNotifications = false;

  notifications$: Observable<NotificationItem[]>;
  unreadCount$: Observable<number>;

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
    this.unreadCount$ = this.notificationService.unreadCount$;
  }

  ngOnInit(): void {
    this.notificationService.fetchNotifications().subscribe();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    document.body.classList.toggle('sidebar-collapsed', this.isCollapsed);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationService.fetchNotifications().subscribe();
    }
  }

  markAsRead(item: NotificationItem, event: Event): void {
    event.stopPropagation();
    this.notificationService.markRead(item._id).subscribe();
  }

  markAllAsRead(): void {
    this.notificationService.markAllRead().subscribe();
  }

  deleteNotification(item: NotificationItem, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(item._id).subscribe();
  }

  clearAll(): void {
    this.notificationService.clearAll().subscribe();
    this.showNotifications = false;
  }
}
