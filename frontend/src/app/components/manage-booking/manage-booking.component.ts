import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { BookingResponse } from '../../core/models/hotel.model';

@Component({
  selector: 'app-manage-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-booking-page">
      
      <!-- Header Banner -->
      <section class="manage-hero">
        <div class="container">
          <h1 class="page-title">Manage Your Reservation</h1>
          <p class="page-subtitle">
            Retrieve, review, or cancel your hotel reservations anytime using your unique booking reference and email.
          </p>

          <!-- Search Form Card -->
          <div class="lookup-card">
            <form (ngSubmit)="lookupBooking()" class="lookup-form">
              <div class="form-field">
                <label for="bookingRef">Booking Reference</label>
                <div class="input-wrap">
                  <span class="material-symbols-outlined icon">tag</span>
                  <input type="text"
                         id="bookingRef"
                         name="reference"
                         [(ngModel)]="searchReference"
                         required
                         placeholder="e.g. TC-BK-100201"
                         class="lookup-input">
                </div>
              </div>

              <div class="form-field">
                <label for="guestEmail">Customer Email</label>
                <div class="input-wrap">
                  <span class="material-symbols-outlined icon">mail</span>
                  <input type="email"
                         id="guestEmail"
                         name="email"
                         [(ngModel)]="searchEmail"
                         required
                         email
                         placeholder="e.g. john.doe@thomascook.com"
                         class="lookup-input">
                </div>
              </div>

              <div class="form-action">
                <button type="submit"
                        class="btn-find"
                        [disabled]="!searchReference.trim() || !searchEmail.trim() || isLoading">
                  <span class="material-symbols-outlined">search</span>
                  <span>{{ isLoading ? 'Finding...' : 'Find Reservation' }}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      <!-- Main Content Area -->
      <section class="container result-section">
        
        <!-- Error Alert -->
        <div *ngIf="errorMessage" class="alert-box alert-error animate-fade-in">
          <span class="material-symbols-outlined">error</span>
          <div class="alert-text">
            <strong>Reservation Not Found:</strong> {{ errorMessage }}
          </div>
        </div>

        <!-- Success Cancel Alert -->
        <div *ngIf="cancellationSuccess" class="alert-box alert-success animate-fade-in">
          <span class="material-symbols-outlined">check_circle</span>
          <div class="alert-text">
            <strong>Booking Cancelled Successfully!</strong>
            Your reservation has been cancelled, and the room availability has been instantly restored for other travelers.
          </div>
        </div>

        <!-- Initial Helper Prompt -->
        <div *ngIf="!booking && !errorMessage && !isLoading" class="empty-prompt-card">
          <div class="prompt-icon-wrap">
            <span class="material-symbols-outlined">receipt_long</span>
          </div>
          <h3>Find Your Hotel Reservation</h3>
          <p>
            Enter your booking reference code (found in your confirmation voucher or booking screen) along with the email address used during checkout.
          </p>
          <div class="demo-hints">
            <span class="hint-label">Sample Seed Bookings for Demo:</span>
            <div class="hint-chips">
              <button class="hint-chip" (click)="fillDemo('TC-BK-100201', 'john.doe@thomascook.com')">
                London: TC-BK-100201 (john.doe&#64;thomascook.com)
              </button>
              <button class="hint-chip" (click)="fillDemo('TC-BK-100202', 'emma.watson@paris.com')">
                Paris: TC-BK-100202 (emma.watson&#64;paris.com)
              </button>
            </div>
          </div>
        </div>

        <!-- Booking Details Card -->
        <div *ngIf="booking" class="booking-voucher-card animate-fade-in">
          
          <div class="voucher-top-bar">
            <div class="voucher-id-stack">
              <span class="top-tag">Booking Reference</span>
              <span class="booking-ref-title">{{ booking.bookingReference }}</span>
            </div>

            <!-- Status Badge -->
            <div class="status-pill"
                 [class.status-confirmed]="booking.status === 'CONFIRMED'"
                 [class.status-cancelled]="booking.status === 'CANCELLED'">
              <span class="material-symbols-outlined">
                {{ booking.status === 'CONFIRMED' ? 'verified' : 'cancel' }}
              </span>
              <span>{{ booking.status }}</span>
            </div>
          </div>

          <div class="voucher-grid">
            
            <!-- Left Info -->
            <div class="voucher-main-col">
              <div class="info-group">
                <span class="group-label">Hotel & Destination</span>
                <h3 class="hotel-title-text">{{ booking.hotelName }}</h3>
                <p class="hotel-loc-text">
                  <span class="material-symbols-outlined">location_on</span>
                  {{ booking.hotelAddress }}, {{ booking.hotelCity }}
                </p>
              </div>

              <div class="info-group">
                <span class="group-label">Selected Suite</span>
                <p class="room-type-text">{{ booking.roomType }}</p>
              </div>

              <div class="dates-strip">
                <div class="date-box">
                  <span class="d-label">Check-in</span>
                  <span class="d-val">{{ booking.checkInDate }}</span>
                </div>
                <div class="d-arrow">
                  <span class="material-symbols-outlined">arrow_forward</span>
                  <span class="night-count">{{ booking.totalNights }} {{ booking.totalNights === 1 ? 'Night' : 'Nights' }}</span>
                </div>
                <div class="date-box">
                  <span class="d-label">Check-out</span>
                  <span class="d-val">{{ booking.checkOutDate }}</span>
                </div>
              </div>
            </div>

            <!-- Right Info (Pricing & Actions) -->
            <div class="voucher-side-col">
              <div class="guest-box">
                <span class="group-label">Primary Guest</span>
                <p class="guest-name">{{ booking.customerName }}</p>
                <p class="guest-email">{{ booking.customerEmail }}</p>
              </div>

              <div class="price-summary-box">
                <div class="rate-line">
                  <span>Rate per night:</span>
                  <span>\${{ booking.pricePerNight | number:'1.2-2' }}</span>
                </div>
                <div class="total-line">
                  <span>Total Amount:</span>
                  <span class="total-val">\${{ booking.totalPrice | number:'1.2-2' }}</span>
                </div>
              </div>

              <!-- Cancellation & Actions -->
              <div class="action-dock">
                <button class="btn btn-print" (click)="printVoucher()">
                  <span class="material-symbols-outlined">print</span>
                  <span>Print Voucher</span>
                </button>

                <!-- Cancel Button -->
                <button *ngIf="booking.status === 'CONFIRMED'"
                        class="btn btn-cancel"
                        [disabled]="isCancelling"
                        (click)="confirmCancellation()">
                  <span class="material-symbols-outlined">cancel</span>
                  <span>{{ isCancelling ? 'Cancelling...' : 'Cancel Reservation' }}</span>
                </button>

                <div *ngIf="booking.status === 'CANCELLED'" class="cancelled-notice">
                  <span class="material-symbols-outlined">info</span>
                  <span>This booking was cancelled. Inventory was restored to the portal.</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  `,
  styles: [`
    .manage-hero {
      background: linear-gradient(135deg, #001f3f 0%, #003366 100%);
      color: #ffffff;
      padding: 50px 0 60px;
    }

    .page-title {
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }

    .page-subtitle {
      font-size: 1rem;
      color: #cbd5e1;
      max-width: 600px;
      margin-bottom: 30px;
    }

    .lookup-card {
      background: #ffffff;
      border-radius: var(--radius-lg);
      padding: 22px;
      box-shadow: 0 12px 30px rgba(0, 20, 50, 0.25);
      max-width: 800px;
    }

    .lookup-form {
      display: grid;
      grid-template-columns: 1.2fr 1.5fr 1fr;
      gap: 16px;
      align-items: flex-end;
    }

    .form-field label {
      display: block;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrap .icon {
      position: absolute;
      left: 12px;
      color: var(--primary-color);
      pointer-events: none;
    }

    .lookup-input {
      width: 100%;
      height: 48px;
      padding: 0 12px 0 42px;
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      color: var(--text-dark);
      background: #f8fafc;
      transition: all 0.2s;
    }

    .lookup-input:focus {
      border-color: var(--primary-color);
      background: #ffffff;
    }

    .btn-find {
      width: 100%;
      height: 48px;
      background: var(--accent-gold);
      color: var(--primary-color);
      font-size: 0.95rem;
      font-weight: 800;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-shadow: 0 4px 10px rgba(245, 178, 27, 0.35);
    }

    .btn-find:hover:not(:disabled) {
      background: var(--accent-gold-hover);
    }

    .btn-find:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .result-section {
      padding: 40px 1.5rem 80px;
    }

    /* Alerts */
    .alert-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: var(--radius-md);
      margin-bottom: 24px;
      font-size: 0.95rem;
    }

    .alert-error {
      background: var(--danger-bg);
      color: var(--danger-color);
      border: 1px solid #fecaca;
    }

    .alert-success {
      background: var(--success-bg);
      color: var(--success-color);
      border: 1px solid #a7f3d0;
    }

    /* Empty Prompt */
    .empty-prompt-card {
      background: #ffffff;
      border: 1px dashed var(--border-color);
      border-radius: var(--radius-lg);
      padding: 50px 30px;
      text-align: center;
      max-width: 680px;
      margin: 0 auto;
    }

    .prompt-icon-wrap {
      width: 64px;
      height: 64px;
      background: var(--primary-light);
      color: var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .prompt-icon-wrap .material-symbols-outlined {
      font-size: 32px;
    }

    .empty-prompt-card h3 {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 8px;
    }

    .empty-prompt-card p {
      color: var(--text-muted);
      font-size: 0.92rem;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .demo-hints {
      border-top: 1px solid var(--border-color);
      padding-top: 20px;
    }

    .hint-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      display: block;
      margin-bottom: 10px;
    }

    .hint-chips {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .hint-chip {
      background: #f1f5f9;
      color: var(--primary-color);
      padding: 6px 12px;
      border-radius: 14px;
      font-size: 0.82rem;
      font-weight: 600;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
    }

    .hint-chip:hover {
      background: var(--primary-light);
      border-color: var(--primary-color);
    }

    /* Voucher Card */
    .booking-voucher-card {
      background: #ffffff;
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .voucher-top-bar {
      background: #f8fafc;
      border-bottom: 1px solid var(--border-color);
      padding: 18px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .top-tag {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--text-muted);
      display: block;
    }

    .booking-ref-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-color);
      letter-spacing: 0.5px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 800;
    }

    .status-confirmed {
      background: var(--success-bg);
      color: var(--success-color);
      border: 1px solid #a7f3d0;
    }

    .status-cancelled {
      background: var(--danger-bg);
      color: var(--danger-color);
      border: 1px solid #fecaca;
    }

    .voucher-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      padding: 28px;
      gap: 36px;
    }

    .voucher-main-col {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .group-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      display: block;
      margin-bottom: 4px;
    }

    .hotel-title-text {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--primary-color);
      margin-bottom: 4px;
    }

    .hotel-loc-text {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .room-type-text {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-dark);
    }

    .dates-strip {
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 14px 18px;
      gap: 20px;
    }

    .date-box {
      display: flex;
      flex-direction: column;
    }

    .d-label {
      font-size: 0.72rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }

    .d-val {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .d-arrow {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--text-muted);
    }

    .night-count {
      font-size: 0.75rem;
      font-weight: 700;
      background: var(--accent-gold);
      color: var(--primary-color);
      padding: 2px 8px;
      border-radius: 10px;
      margin-top: 2px;
    }

    .voucher-side-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-left: 1px solid var(--border-color);
      padding-left: 36px;
    }

    .guest-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-dark);
    }

    .guest-email {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .price-summary-box {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      padding: 14px 18px;
      border-radius: var(--radius-md);
      margin: 20px 0;
    }

    .rate-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .total-line {
      display: flex;
      justify-content: space-between;
      font-size: 1.1rem;
      font-weight: 800;
      border-top: 1px solid var(--border-color);
      padding-top: 8px;
      color: var(--primary-color);
    }

    .total-val {
      color: var(--success-color);
    }

    .action-dock {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .btn {
      width: 100%;
      padding: 11px;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .btn-print {
      background: #ffffff;
      border: 1.5px solid var(--border-color);
      color: var(--text-dark);
    }

    .btn-print:hover {
      background: #f1f5f9;
    }

    .btn-cancel {
      background: var(--danger-bg);
      border: 1.5px solid #fecaca;
      color: var(--danger-color);
    }

    .btn-cancel:hover:not(:disabled) {
      background: #fee2e2;
    }

    .cancelled-notice {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #f1f5f9;
      color: #64748b;
      padding: 10px;
      border-radius: var(--radius-md);
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      .lookup-form {
        grid-template-columns: 1fr;
      }
      .voucher-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      .voucher-side-col {
        border-left: none;
        border-top: 1px solid var(--border-color);
        padding-left: 0;
        padding-top: 24px;
      }
    }
  `]
})
export class ManageBookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  searchReference: string = '';
  searchEmail: string = '';
  isLoading: boolean = false;
  isCancelling: boolean = false;
  errorMessage: string = '';
  cancellationSuccess: boolean = false;
  booking: BookingResponse | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['reference'] && params['email']) {
        this.searchReference = params['reference'];
        this.searchEmail = params['email'];
        this.lookupBooking();
      }
    });
  }

  lookupBooking(): void {
    if (!this.searchReference.trim() || !this.searchEmail.trim()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cancellationSuccess = false;

    this.bookingService.lookupBooking(this.searchReference, this.searchEmail).subscribe({
      next: (res) => {
        this.booking = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.booking = null;
        if (err.status === 404) {
          this.errorMessage = `No reservation found matching reference "${this.searchReference}" and email "${this.searchEmail}".`;
        } else {
          this.errorMessage = 'Could not retrieve booking details. Please try again.';
        }
      }
    });
  }

  fillDemo(ref: string, email: string): void {
    this.searchReference = ref;
    this.searchEmail = email;
    this.lookupBooking();
  }

  confirmCancellation(): void {
    if (!this.booking) return;

    const ok = confirm(`Are you sure you want to cancel your reservation for "${this.booking.hotelName}"?\nThis action will release your room inventory immediately.`);
    if (!ok) return;

    this.isCancelling = true;
    this.errorMessage = '';

    this.bookingService.cancelBooking(this.booking.bookingReference, this.booking.customerEmail).subscribe({
      next: (cancelled) => {
        this.isCancelling = false;
        this.booking = cancelled;
        this.cancellationSuccess = true;
      },
      error: (err) => {
        this.isCancelling = false;
        this.errorMessage = err.error?.message || 'Failed to cancel the booking. Please try again.';
      }
    });
  }

  printVoucher(): void {
    window.print();
  }
}
