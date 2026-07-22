export interface NotificationItem {
  _id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  taskRef?: { _id: string; taskName: string };
  matchRef?: { _id: string; opponent: string; matchDate: string };
  createdAt: string;
}

export interface NotificationResponse {
  success: boolean;
  count: number;
  unreadCount: number;
  data: NotificationItem[];
}
