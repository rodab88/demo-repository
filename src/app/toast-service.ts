import { Injectable, TemplateRef } from '@angular/core';
import { Notification } from './models/notification'

@Injectable({ providedIn: 'root' })
export class ToastService {
  public toasts: any[] = [];

  show(textOrTpl: Notification | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}