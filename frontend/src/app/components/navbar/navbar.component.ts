import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ComparisonService } from '../../core/services/comparison.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar-wrapper">
      <div class="container navbar-inner">
        <!-- Brand Logo -->
        <a routerLink="/" class="brand-link">
          <div class="brand-badge">TC</div>
          <div class="brand-text">
            <span class="brand-name">Thomas Cook</span>
            <span class="brand-sub">Hotel Booking Portal</span>
          </div>
        </a>

        <!-- Navigation Links -->
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-item">
            <span class="material-symbols-outlined">hotel</span>
            <span>Explore Hotels</span>
          </a>

          <a routerLink="/manage-booking" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">confirmation_number</span>
            <span>My Bookings</span>
          </a>

          <!-- Compare Tray Trigger Button -->
          <button *ngIf="(comparisonService.selectedHotels$ | async) as hotels"
                  (click)="comparisonService.openModal()"
                  class="compare-btn"
                  [class.has-items]="hotels.length > 0"
                  [disabled]="hotels.length < 2"
                  title="Compare up to 3 hotels side-by-side">
            <span class="material-symbols-outlined">compare_arrows</span>
            <span>Compare ({{ hotels.length }}/3)</span>
          </button>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .navbar-wrapper {
      background-color: var(--primary-color);
      color: #ffffff;
      box-shadow: 0 2px 10px rgba(0, 51, 102, 0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .brand-badge {
      background-color: var(--accent-gold);
      color: var(--primary-color);
      font-weight: 800;
      font-size: 1.2rem;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: -0.5px;
      box-shadow: 0 2px 6px rgba(245, 178, 27, 0.4);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      line-height: 1.1;
    }

    .brand-sub {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.75);
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 500;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.95rem;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
    }

    .nav-item:hover, .nav-item.active {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.12);
    }

    .compare-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background-color: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 700;
      border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .compare-btn.has-items {
      background-color: var(--accent-gold);
      color: var(--primary-color);
      border-color: var(--accent-gold);
      box-shadow: 0 2px 8px rgba(245, 178, 27, 0.4);
    }

    .compare-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .compare-btn:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    @media (max-width: 640px) {
      .brand-sub { display: none; }
      .nav-item span:not(.material-symbols-outlined) { display: none; }
      .compare-btn span:not(.material-symbols-outlined) { font-size: 0.8rem; }
    }
  `]
})
export class NavbarComponent {
  comparisonService = inject(ComparisonService);
}
