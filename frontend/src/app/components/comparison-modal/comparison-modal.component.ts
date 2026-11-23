import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ComparisonService } from '../../core/services/comparison.service';
import { HotelService } from '../../core/services/hotel.service';
import { HotelComparison } from '../../core/models/hotel.model';

@Component({
  selector: 'app-comparison-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="compare-modal-backdrop" *ngIf="comparisonService.isModalOpen$ | async" (click)="close()">
      <div class="compare-modal-card animate-fade-in" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="modal-header">
          <div class="header-left">
            <span class="material-symbols-outlined header-icon">compare_arrows</span>
            <div>
              <h2 class="header-title">Hotel Comparison Matrix</h2>
              <p class="header-sub">Side-by-side evaluation of up to 3 luxury accommodations</p>
            </div>
          </div>
          <button class="close-btn" (click)="close()">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="modal-loading">
          <div class="spinner"></div>
          <p>Fetching comparative attributes and amenities...</p>
        </div>

        <!-- Comparison Table Container -->
        <div *ngIf="!isLoading && hotels.length > 0" class="modal-body-scroll">
          <div class="table-responsive">
            <table class="comparison-table">
              
              <!-- Row: Hotel Basic Cards -->
              <thead>
                <tr>
                  <th class="feature-col">Hotel</th>
                  <th *ngFor="let h of hotels" class="hotel-col">
                    <div class="hotel-summary-card">
                      <div class="thumb-wrap">
                        <img [src]="h.imageUrl" [alt]="h.name" class="hotel-thumb">
                        <button class="remove-col-btn" (click)="removeHotel(h.id)" title="Remove from comparison">
                          <span class="material-symbols-outlined">close</span>
                        </button>
                      </div>
                      <h4 class="hotel-name">{{ h.name }}</h4>
                      <p class="hotel-loc">
                        <span class="material-symbols-outlined">location_on</span>
                        {{ h.city }}
                      </p>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                <!-- Row: Starting Price -->
                <tr class="highlight-row">
                  <td class="feature-label">
                    <span class="material-symbols-outlined">payments</span>
                    <span>Starting Price</span>
                  </td>
                  <td *ngFor="let h of hotels" class="data-cell">
                    <div class="price-stack">
                      <div class="price-val">
                        <span class="currency">$</span>
                        <span class="amount">{{ h.startingPrice | number:'1.0-0' }}</span>
                        <span class="unit">/ night</span>
                      </div>
                      <span *ngIf="isLowestPrice(h.startingPrice)" class="best-value-badge">
                        <span class="material-symbols-outlined">verified</span>
                        Best Value
                      </span>
                    </div>
                  </td>
                </tr>

                <!-- Row: Star Rating -->
                <tr>
                  <td class="feature-label">
                    <span class="material-symbols-outlined">star</span>
                    <span>Star Rating</span>
                  </td>
                  <td *ngFor="let h of hotels" class="data-cell">
                    <div class="rating-cell">
                      <span class="rating-number">{{ h.rating | number:'1.1-1' }}</span>
                      <div class="stars-visual">
                        <span *ngFor="let s of [1,2,3,4,5]" class="material-symbols-outlined star-icon"
                              [class.filled]="s <= h.rating">
                          star
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Row: Location & Address -->
                <tr>
                  <td class="feature-label">
                    <span class="material-symbols-outlined">map</span>
                    <span>Address</span>
                  </td>
                  <td *ngFor="let h of hotels" class="data-cell address-cell">
                    {{ h.address }}
                  </td>
                </tr>

                <!-- Row: Available Suites -->
                <tr>
                  <td class="feature-label">
                    <span class="material-symbols-outlined">meeting_room</span>
                    <span>Room Categories</span>
                  </td>
                  <td *ngFor="let h of hotels" class="data-cell">
                    <ul class="room-types-list">
                      <li *ngFor="let rt of h.roomTypes">{{ rt }}</li>
                    </ul>
                  </td>
                </tr>

                <!-- Amenities Comparison Section -->
                <tr class="section-divider-row">
                  <td [attr.colspan]="hotels.length + 1">
                    <div class="amenities-divider-label">
                      <span class="material-symbols-outlined">fact_check</span>
                      <span>Amenity Breakdown</span>
                    </div>
                  </td>
                </tr>

                <!-- Specific Amenities Rows -->
                <tr *ngFor="let amenityName of standardAmenities">
                  <td class="feature-label indent">
                    <span>{{ amenityName }}</span>
                  </td>
                  <td *ngFor="let h of hotels" class="data-cell amenity-status-cell">
                    <span *ngIf="hasAmenity(h, amenityName)" class="check-icon" title="Included">
                      <span class="material-symbols-outlined">check_circle</span>
                    </span>
                    <span *ngIf="!hasAmenity(h, amenityName)" class="cross-icon" title="Not available">
                      <span class="material-symbols-outlined">cancel</span>
                    </span>
                  </td>
                </tr>

                <!-- Row: Action Button -->
                <tr class="action-row">
                  <td class="feature-label">
                    <span>Action</span>
                  </td>
                  <td *ngFor="let h of hotels" class="data-cell action-cell">
                    <button class="btn-book-now" (click)="goToHotel(h.id)">
                      <span>Book {{ h.name.split(' ')[0] }}</span>
                      <span class="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </td>
                </tr>

              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .compare-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 20, 45, 0.7);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2500;
      padding: 1.5rem;
    }

    .compare-modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 1100px;
      max-height: 90vh;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      background: var(--primary-color);
      color: #ffffff;
      padding: 20px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-icon {
      font-size: 32px;
      color: var(--accent-gold);
    }

    .header-title {
      font-size: 1.35rem;
      font-weight: 800;
      line-height: 1.1;
    }

    .header-sub {
      font-size: 0.82rem;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 2px;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .modal-loading {
      padding: 80px 20px;
      text-align: center;
      color: var(--text-muted);
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--primary-light);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 12px;
    }

    .modal-body-scroll {
      overflow-y: auto;
      padding: 20px 28px 40px;
    }

    .table-responsive {
      width: 100%;
      overflow-x: auto;
    }

    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .feature-col {
      width: 200px;
      text-align: left;
      padding: 16px;
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-muted);
      border-bottom: 2px solid var(--border-color);
    }

    .hotel-col {
      width: calc((100% - 200px) / 3);
      padding: 16px;
      border-bottom: 2px solid var(--border-color);
      vertical-align: top;
    }

    .hotel-summary-card {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .thumb-wrap {
      position: relative;
      height: 120px;
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .hotel-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-col-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      background: rgba(0, 0, 0, 0.6);
      color: #ffffff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-col-btn .material-symbols-outlined {
      font-size: 14px;
    }

    .hotel-name {
      font-size: 1rem;
      font-weight: 800;
      color: var(--primary-color);
      line-height: 1.2;
    }

    .hotel-loc {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .hotel-loc .material-symbols-outlined {
      font-size: 15px;
    }

    .comparison-table td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-color);
      font-size: 0.9rem;
    }

    .feature-label {
      font-weight: 700;
      color: var(--text-dark);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .feature-label .material-symbols-outlined {
      font-size: 18px;
      color: var(--primary-color);
    }

    .feature-label.indent {
      padding-left: 28px;
      font-weight: 500;
      color: var(--text-dark);
    }

    .highlight-row {
      background: #f8fafc;
    }

    .price-stack {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .price-val {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .price-val .currency {
      font-size: 0.9rem;
      font-weight: 700;
    }

    .price-val .amount {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--primary-color);
    }

    .price-val .unit {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .best-value-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--success-bg);
      color: var(--success-color);
      font-size: 0.72rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 10px;
      width: fit-content;
    }

    .best-value-badge .material-symbols-outlined {
      font-size: 14px;
    }

    .rating-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .rating-number {
      font-weight: 800;
      font-size: 0.95rem;
      color: var(--primary-color);
    }

    .stars-visual {
      display: flex;
    }

    .star-icon {
      font-size: 16px;
      color: #e2e8f0;
    }

    .star-icon.filled {
      color: #f59e0b;
    }

    .address-cell {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .room-types-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.8rem;
      color: #475569;
    }

    .room-types-list li::before {
      content: "• ";
      color: var(--primary-color);
      font-weight: bold;
    }

    .section-divider-row td {
      background: var(--primary-light);
      padding: 10px 16px;
    }

    .amenities-divider-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      font-size: 0.85rem;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .amenity-status-cell {
      text-align: center;
    }

    .check-icon {
      color: var(--success-color);
    }

    .cross-icon {
      color: #cbd5e1;
    }

    .action-cell {
      padding-top: 20px;
    }

    .btn-book-now {
      width: 100%;
      background: var(--accent-gold);
      color: var(--primary-color);
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-shadow: 0 2px 8px rgba(245, 178, 27, 0.3);
    }

    .btn-book-now:hover {
      background: var(--accent-gold-hover);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ComparisonModalComponent implements OnInit {
  comparisonService = inject(ComparisonService);
  private hotelService = inject(HotelService);
  private router = inject(Router);

  hotels: HotelComparison[] = [];
  isLoading: boolean = false;

  standardAmenities: string[] = [
    'Free High-Speed Wi-Fi',
    'Outdoor Swimming Pool',
    'Luxury Wellness Spa',
    'Complimentary Gourmet Breakfast',
    '24/7 Fitness Center',
    'Airport Shuttle Transfer',
    '24/7 Concierge & Room Service',
    'Secure Valet Parking'
  ];

  ngOnInit(): void {
    this.comparisonService.isModalOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.fetchComparisonData();
      }
    });
  }

  fetchComparisonData(): void {
    const selected = this.comparisonService.currentHotels;
    if (selected.length < 2) {
      this.close();
      return;
    }

    this.isLoading = true;
    const ids = selected.map(h => h.id);

    this.hotelService.compareHotels(ids).subscribe({
      next: (data) => {
        this.hotels = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  hasAmenity(hotel: HotelComparison, amenityName: string): boolean {
    return hotel.amenities.some(a => a.name.toLowerCase().includes(amenityName.toLowerCase().split(' ')[0]));
  }

  isLowestPrice(price: number): boolean {
    if (!this.hotels || this.hotels.length === 0) return false;
    const minPrice = Math.min(...this.hotels.map(h => h.startingPrice));
    return price === minPrice;
  }

  removeHotel(id: number): void {
    this.comparisonService.removeHotel(id);
    this.hotels = this.hotels.filter(h => h.id !== id);
    if (this.hotels.length < 2) {
      this.close();
    }
  }

  goToHotel(id: number): void {
    this.close();
    this.router.navigate(['/hotel', id]);
  }

  close(): void {
    this.comparisonService.closeModal();
  }
}
