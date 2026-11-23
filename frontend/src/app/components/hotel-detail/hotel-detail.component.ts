import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HotelService } from '../../core/services/hotel.service';
import { HotelDetail, Room } from '../../core/models/hotel.model';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BookingModalComponent],
  template: `
    <div class="hotel-detail-page" *ngIf="hotel">
      
      <!-- Top Breadcrumb Bar -->
      <div class="breadcrumb-bar">
        <div class="container">
          <a routerLink="/" class="back-link">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Back to All Hotels</span>
          </a>
        </div>
      </div>

      <!-- Hotel Hero Section -->
      <section class="hotel-hero">
        <div class="container">
          <div class="hero-split">
            
            <div class="hotel-info-col">
              <div class="hotel-badge-row">
                <span class="city-badge">
                  <span class="material-symbols-outlined">location_on</span>
                  {{ hotel.city }}
                </span>
                <span class="rating-badge">
                  <span class="material-symbols-outlined star-icon">star</span>
                  {{ hotel.rating | number:'1.1-1' }} / 5.0
                </span>
              </div>

              <h1 class="hotel-title">{{ hotel.name }}</h1>
              <p class="hotel-address">
                <span class="material-symbols-outlined">map</span>
                {{ hotel.address }}
              </p>

              <p class="hotel-description">{{ hotel.description }}</p>

              <div class="contact-strip">
                <span class="contact-item">
                  <span class="material-symbols-outlined">call</span>
                  {{ hotel.contactPhone }}
                </span>
                <span class="contact-item">
                  <span class="material-symbols-outlined">mail</span>
                  {{ hotel.contactEmail }}
                </span>
              </div>
            </div>

            <!-- Image Wrap -->
            <div class="hotel-hero-image-wrap">
              <img [src]="hotel.imageUrl" [alt]="hotel.name" class="hotel-hero-img">
            </div>

          </div>
        </div>
      </section>

      <!-- Hotel Content & Room Booking -->
      <section class="container detail-content-section">
        
        <!-- Amenities Section -->
        <div class="amenities-card">
          <h3 class="section-heading">Featured Hotel Amenities</h3>
          <div class="amenities-grid">
            <div *ngFor="let amenity of hotel.amenities" class="amenity-item">
              <div class="amenity-icon-box">
                <span class="material-symbols-outlined">{{ amenity.iconCode || 'check_circle' }}</span>
              </div>
              <span class="amenity-label">{{ amenity.name }}</span>
            </div>
          </div>
        </div>

        <!-- Date Selector Strip for Real-Time Room Availability -->
        <div class="availability-filter-bar">
          <div class="bar-title">
            <span class="material-symbols-outlined">date_range</span>
            <span>Select Dates to Check Live Room Availability:</span>
          </div>

          <div class="date-pickers-row">
            <div class="date-field">
              <label for="detailCheckIn">Check-In</label>
              <input type="date"
                     id="detailCheckIn"
                     [(ngModel)]="checkInDate"
                     [min]="minCheckInDate"
                     (change)="onDateChange()"
                     class="date-input">
            </div>

            <div class="date-field">
              <label for="detailCheckOut">Check-Out</label>
              <input type="date"
                     id="detailCheckOut"
                     [(ngModel)]="checkOutDate"
                     [min]="minCheckOutDate"
                     (change)="onDateChange()"
                     class="date-input">
            </div>

            <div class="stay-info-chip">
              <span class="nights-number">{{ totalNights }}</span>
              <span>{{ totalNights === 1 ? 'Night' : 'Nights' }} Stay</span>
            </div>
          </div>
        </div>

        <!-- Room Types & Inventory Table -->
        <div class="rooms-section">
          <h2 class="section-heading">Available Room Categories</h2>
          <p class="section-subtext">Choose your preferred suite. Real-time availability is strictly guaranteed.</p>

          <div class="room-cards-deck">
            <div *ngFor="let room of hotel.rooms" class="room-card" [class.sold-out]="room.availableRooms === 0">
              
              <div class="room-details-col">
                <div class="room-header-row">
                  <h3 class="room-type-title">{{ room.roomType }}</h3>
                  
                  <!-- Live Inventory Badge -->
                  <div class="availability-badge"
                       [class.in-stock]="(room.availableRooms ?? room.totalInventory) > 2"
                       [class.low-stock]="(room.availableRooms ?? room.totalInventory) > 0 && (room.availableRooms ?? room.totalInventory) <= 2"
                       [class.out-of-stock]="(room.availableRooms ?? room.totalInventory) === 0">
                    <span class="material-symbols-outlined">
                      {{ (room.availableRooms ?? room.totalInventory) > 0 ? 'check_circle' : 'block' }}
                    </span>
                    <span *ngIf="(room.availableRooms ?? room.totalInventory) > 2">
                      {{ room.availableRooms ?? room.totalInventory }} Rooms Available
                    </span>
                    <span *ngIf="(room.availableRooms ?? room.totalInventory) > 0 && (room.availableRooms ?? room.totalInventory) <= 2">
                      Only {{ room.availableRooms }} room{{ room.availableRooms === 1 ? '' : 's' }} left!
                    </span>
                    <span *ngIf="(room.availableRooms ?? room.totalInventory) === 0">
                      Sold Out for Dates
                    </span>
                  </div>
                </div>

                <p class="room-desc">{{ room.description }}</p>

                <div class="room-perks">
                  <span class="perk-chip">
                    <span class="material-symbols-outlined">group</span>
                    Up to {{ room.maxOccupancy }} Guests
                  </span>
                  <span class="perk-chip">
                    <span class="material-symbols-outlined">king_bed</span>
                    Premium Luxury Bedding
                  </span>
                  <span class="perk-chip">
                    <span class="material-symbols-outlined">verified</span>
                    Instant Confirmation
                  </span>
                </div>
              </div>

              <!-- Price & Book Col -->
              <div class="room-booking-col">
                <div class="room-price-stack">
                  <span class="rate-label">Per Night</span>
                  <div class="rate-val">
                    <span class="currency">₹</span>
                    <span class="amount">{{ room.pricePerNight | number:'1.0-0' }}</span>
                  </div>
                  <span class="stay-total-hint" *ngIf="totalNights > 1">
                    ₹{{ (room.pricePerNight * totalNights) | number:'1.0-0' }} total for {{ totalNights }} nights
                  </span>
                </div>

                <button class="btn-book-room"
                        [disabled]="(room.availableRooms ?? room.totalInventory) === 0"
                        (click)="openBookingModal(room)">
                  <span class="material-symbols-outlined">key</span>
                  <span>{{ (room.availableRooms ?? room.totalInventory) === 0 ? 'Unavailable' : 'Book This Room' }}</span>
                </button>
              </div>

            </div>
          </div>
        </div>

      </section>

      <!-- Booking Modal Overlay -->
      <app-booking-modal
        *ngIf="selectedRoomForBooking"
        [hotel]="hotel"
        [room]="selectedRoomForBooking"
        [checkInDate]="checkInDate"
        [checkOutDate]="checkOutDate"
        [totalNights]="totalNights"
        (closeEvent)="onBookingModalClose($event)">
      </app-booking-modal>

    </div>

    <!-- Loading State -->
    <div *ngIf="isLoading" class="container page-loading">
      <div class="spinner-large"></div>
      <p>Loading luxury hotel details...</p>
    </div>
  `,
  styles: [`
    .breadcrumb-bar {
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      padding: 14px 0;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--primary-color);
      font-size: 0.9rem;
      font-weight: 700;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .hotel-hero {
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      padding: 40px 0;
    }

    .hero-split {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .hotel-badge-row {
      display: flex;
      gap: 12px;
      margin-bottom: 14px;
    }

    .city-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--primary-light);
      color: var(--primary-color);
      font-size: 0.85rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 14px;
    }

    .rating-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--accent-gold-light);
      color: #855d00;
      font-size: 0.85rem;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 14px;
    }

    .star-icon {
      color: #f59e0b;
      font-size: 16px;
    }

    .hotel-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--primary-color);
      line-height: 1.2;
      margin-bottom: 8px;
    }

    .hotel-address {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 18px;
    }

    .hotel-description {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--text-dark);
      margin-bottom: 24px;
    }

    .contact-strip {
      display: flex;
      gap: 20px;
      font-size: 0.88rem;
      color: var(--text-muted);
      flex-wrap: wrap;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .contact-item .material-symbols-outlined {
      color: var(--primary-color);
      font-size: 18px;
    }

    .hotel-hero-image-wrap {
      height: 380px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
    }

    .hotel-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .detail-content-section {
      padding: 40px 1.5rem 80px;
    }

    /* Amenities Card */
    .amenities-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 28px;
      margin-bottom: 30px;
    }

    .section-heading {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--primary-color);
      margin-bottom: 20px;
    }

    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .amenity-item {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f8fafc;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      border: 1px solid #edf2f7;
    }

    .amenity-icon-box {
      color: var(--primary-color);
      display: flex;
      align-items: center;
    }

    .amenity-label {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-dark);
    }

    /* Availability Date Bar */
    .availability-filter-bar {
      background: linear-gradient(135deg, #002b54 0%, #003366 100%);
      color: #ffffff;
      border-radius: var(--radius-lg);
      padding: 22px 28px;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
    }

    .bar-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.05rem;
      font-weight: 700;
    }

    .date-pickers-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .date-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .date-field label {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      font-weight: 600;
    }

    .date-input {
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .date-input::-webkit-calendar-picker-indicator {
      filter: invert(1);
    }

    .stay-info-chip {
      background: var(--accent-gold);
      color: var(--primary-color);
      padding: 8px 14px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 800;
      font-size: 0.9rem;
    }

    /* Rooms Deck */
    .rooms-section {
      margin-top: 10px;
    }

    .section-subtext {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-top: -12px;
      margin-bottom: 24px;
    }

    .room-cards-deck {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .room-card {
      background: #ffffff;
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: grid;
      grid-template-columns: 1fr 240px;
      gap: 24px;
      align-items: center;
      box-shadow: var(--shadow-sm);
      transition: all 0.2s;
    }

    .room-card:hover {
      border-color: #cbd5e1;
      box-shadow: var(--shadow-md);
    }

    .room-card.sold-out {
      opacity: 0.65;
      background: #fafafa;
    }

    .room-header-row {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .room-type-title {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--primary-color);
    }

    .availability-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
    }

    .availability-badge.in-stock {
      background: var(--success-bg);
      color: var(--success-color);
    }

    .availability-badge.low-stock {
      background: #fffbeb;
      color: #b45309;
    }

    .availability-badge.out-of-stock {
      background: var(--danger-bg);
      color: var(--danger-color);
    }

    .availability-badge .material-symbols-outlined {
      font-size: 16px;
    }

    .room-desc {
      font-size: 0.92rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 14px;
    }

    .room-perks {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .perk-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.8rem;
      color: #475569;
      background: #f1f5f9;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 600;
    }

    .perk-chip .material-symbols-outlined {
      font-size: 15px;
      color: var(--primary-color);
    }

    .room-booking-col {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      border-left: 1px solid var(--border-color);
      padding-left: 24px;
    }

    .room-price-stack {
      text-align: right;
      margin-bottom: 14px;
    }

    .rate-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
      display: block;
    }

    .rate-val {
      display: flex;
      align-items: baseline;
      justify-content: flex-end;
      gap: 2px;
    }

    .rate-val .currency {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-dark);
    }

    .rate-val .amount {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--primary-color);
    }

    .stay-total-hint {
      font-size: 0.82rem;
      color: var(--text-muted);
      display: block;
    }

    .btn-book-room {
      width: 100%;
      background: var(--accent-gold);
      color: var(--primary-color);
      padding: 12px 18px;
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 10px rgba(245, 178, 27, 0.3);
    }

    .btn-book-room:hover:not(:disabled) {
      background: var(--accent-gold-hover);
      transform: translateY(-1px);
    }

    .btn-book-room:disabled {
      background: #e2e8f0;
      color: #94a3b8;
      box-shadow: none;
      cursor: not-allowed;
    }

    .page-loading {
      text-align: center;
      padding: 100px 0;
    }

    .spinner-large {
      width: 44px;
      height: 44px;
      border: 4px solid var(--primary-light);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 900px) {
      .hero-split {
        grid-template-columns: 1fr;
      }
      .hotel-hero-image-wrap {
        height: 280px;
      }
      .room-card {
        grid-template-columns: 1fr;
      }
      .room-booking-col {
        border-left: none;
        border-top: 1px solid var(--border-color);
        padding-left: 0;
        padding-top: 16px;
        align-items: stretch;
      }
      .room-price-stack {
        text-align: left;
      }
      .rate-val {
        justify-content: flex-start;
      }
    }
  `]
})
export class HotelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private hotelService = inject(HotelService);

  hotel: HotelDetail | null = null;
  isLoading: boolean = false;
  selectedRoomForBooking: Room | null = null;

  checkInDate: string = '';
  checkOutDate: string = '';
  minCheckInDate: string = '';
  minCheckOutDate: string = '';
  totalNights: number = 1;

  ngOnInit(): void {
    const today = new Date();
    this.minCheckInDate = this.formatDate(today);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    this.minCheckOutDate = this.formatDate(tomorrow);

    this.route.queryParams.subscribe(params => {
      this.checkInDate = params['checkIn'] || this.minCheckInDate;
      this.checkOutDate = params['checkOut'] || this.minCheckOutDate;
      this.calculateNights();
    });

    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.fetchHotel(id);
      }
    });
  }

  fetchHotel(id: number): void {
    this.isLoading = true;
    this.hotelService.getHotelDetails(id, this.checkInDate, this.checkOutDate).subscribe({
      next: (data) => {
        this.hotel = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onDateChange(): void {
    if (this.checkInDate) {
      const nextDay = new Date(this.checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      this.minCheckOutDate = this.formatDate(nextDay);

      if (this.checkOutDate <= this.checkInDate) {
        this.checkOutDate = this.minCheckOutDate;
      }
    }

    this.calculateNights();
    if (this.hotel) {
      this.fetchHotel(this.hotel.id);
    }
  }

  calculateNights(): void {
    if (this.checkInDate && this.checkOutDate) {
      const start = new Date(this.checkInDate).getTime();
      const end = new Date(this.checkOutDate).getTime();
      const diff = Math.ceil((end - start) / (1000 * 3600 * 24));
      this.totalNights = diff > 0 ? diff : 1;
    }
  }

  openBookingModal(room: Room): void {
    this.selectedRoomForBooking = room;
  }

  onBookingModalClose(wasBooked: boolean): void {
    this.selectedRoomForBooking = null;
    if (wasBooked && this.hotel) {
      // Refresh live room availability
      this.fetchHotel(this.hotel.id);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
