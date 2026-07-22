import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'danger';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private counter = 0;
  toasts = signal<ToastMessage[]>([]);

  show(text: string, type: ToastType = 'success') {
    const id = ++this.counter;
    let normalizedType: 'success' | 'error' | 'info' | 'warning' = 'info';
    if (type === 'danger' || type === 'error') normalizedType = 'error';
    else if (type === 'warning') normalizedType = 'warning';
    else if (type === 'success') normalizedType = 'success';

    this.toasts.update(list => [...list, { id, text, type: normalizedType }]);
    setTimeout(() => this.remove(id), 3000);
  }

  remove(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
