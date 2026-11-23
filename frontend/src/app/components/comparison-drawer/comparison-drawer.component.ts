import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparisonService } from '../../core/services/comparison.service';

@Component({
  selector: 'app-comparison-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="drawer-dock animate-fade-in" *ngIf="(comparisonService.selectedHotels$ | async) as selectedHotels">
      <div *ngIf="selectedHotels.length > 0" class="container drawer-inner">
        
        <!-- Left: Status text & counter -->
        <div class="dock-left">
          <div class="dock-badge">
            <span class="material-symbols-outlined">compare_arrows</span>
            <span>Compare Hotels ({{ selectedHotels.length }}/3)</span>
          </div>
          <p class="dock-tip">
            {{ selectedHotels.length === 1 ? 'Select at least 1 more hotel to compare.' : 'Ready to compare side-by-side!' }}
          </p>
        </div>

        <!-- Middle: Hotel Chips -->
        <div class="hotel-chips-scroll">
          <div *ngFor="let h of selectedHotels" class="hotel-dock-chip animate-fade-in">
            <img [src]="h.imageUrl" [alt]="h.name" class="chip-thumb">
            <div class="chip-text">
              <span class="chip-name">{{ h.name }}</span>
              <span class="chip-price">\${{ h.startingPrice | number:'1.0-0' }}/nt</span>
            </div>
            <button class="chip-remove-btn" (click)="comparisonService.removeHotel(h.id)" title="Remove hotel">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="dock-actions">
          <button class="btn-clear" (click)="comparisonService.clearAll()">
            Clear All
          </button>
          <button class="btn-compare-now"
                  [disabled]="selectedHotels.length < 2"
                  (click)="comparisonService.openModal()">
            <span>Compare Now</span>
            <span class="material-symbols-outlined">open_in_new</span>
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .drawer-dock {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw;
      background: rgba(0, 32, 64, 0.95);
      backdrop-filter: blur(10px);
      color: #ffffff;
      padding: 14px 0;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.25);
      z-index: 1500;
      border-top: 2px solid var(--accent-gold);
    }

    .drawer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .dock-left {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 220px;
    }

    .dock-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--accent-gold);
    }

    .dock-tip {
      font-size: 0.78rem;
      color: #cbd5e1;
    }

    .hotel-chips-scroll {
      display: flex;
      align-items: center;
      gap: 12px;
      overflow-x: auto;
      padding: 4px;
      flex: 1;
    }

    .hotel-dock-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-md);
      padding: 6px 10px 6px 6px;
      white-space: nowrap;
    }

    .chip-thumb {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      object-fit: cover;
    }

    .chip-text {
      display: flex;
      flex-direction: column;
    }

    .chip-name {
      font-size: 0.82rem;
      font-weight: 700;
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chip-price {
      font-size: 0.72rem;
      color: var(--accent-gold);
      font-weight: 600;
    }

    .chip-remove-btn {
      background: rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 4px;
    }

    .chip-remove-btn .material-symbols-outlined {
      font-size: 14px;
    }

    .chip-remove-btn:hover {
      background: var(--danger-color);
      color: #ffffff;
    }

    .dock-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-clear {
      background: transparent;
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 8px 12px;
    }

    .btn-clear:hover {
      color: #ffffff;
      text-decoration: underline;
    }

    .btn-compare-now {
      background: var(--accent-gold);
      color: var(--primary-color);
      padding: 10px 20px;
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(245, 178, 27, 0.4);
    }

    .btn-compare-now:hover:not(:disabled) {
      background: var(--accent-gold-hover);
      transform: translateY(-1px);
    }

    .btn-compare-now:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .drawer-inner {
        flex-direction: column;
        align-items: stretch;
      }
      .dock-actions {
        justify-content: flex-end;
      }
    }
  `]
})
export class ComparisonDrawerComponent {
  comparisonService = inject(ComparisonService);
}
