import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts$ | async"
           class="toast-card animate-slide-in"
           [ngClass]="'toast-' + toast.type">
        
        <span class="material-symbols-outlined toast-icon">
          {{ getIcon(toast.type) }}
        </span>

        <span class="toast-message">{{ toast.message }}</span>

        <button class="toast-close-btn" (click)="toastService.remove(toast.id)">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 84px;
      right: 24px;
      z-index: 3000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      background: #ffffff;
      color: var(--text-dark);
      border-left: 5px solid #64748b;
      font-size: 0.9rem;
      font-weight: 600;
      line-height: 1.4;
    }

    .toast-success {
      border-left-color: var(--success-color);
      background: #f0fdf4;
    }
    .toast-success .toast-icon { color: var(--success-color); }

    .toast-error {
      border-left-color: var(--danger-color);
      background: #fef2f2;
    }
    .toast-error .toast-icon { color: var(--danger-color); }

    .toast-warning {
      border-left-color: var(--accent-gold);
      background: #fffbeb;
    }
    .toast-warning .toast-icon { color: #b45309; }

    .toast-info {
      border-left-color: var(--primary-color);
      background: #f0f9ff;
    }
    .toast-info .toast-icon { color: var(--primary-color); }

    .toast-icon {
      font-size: 22px;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
    }

    .toast-close-btn {
      background: transparent;
      color: #94a3b8;
      display: flex;
      align-items: center;
      padding: 2px;
    }

    .toast-close-btn:hover {
      color: var(--text-dark);
    }

    .toast-close-btn .material-symbols-outlined {
      font-size: 16px;
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .animate-slide-in {
      animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }
}
