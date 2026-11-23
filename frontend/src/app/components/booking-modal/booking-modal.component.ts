import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { BookingResponse, CreateBookingRequest, HotelDetail, Room } from '../../core/models/hotel.model';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal-card animate-fade-in" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="modal-header">
          <div>
            <h3 class="modal-title">
              {{ isSuccess ? 'Booking Confirmed!' : 'Complete Your Reservation' }}
            </h3>
            <p class="modal-subtitle" *ngIf="!isSuccess">
              {{ hotel.name }} — {{ room.roomType }}
            </p>
          </div>
          <button class="close-btn" (click)="close()">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Success Screen -->
        <div *ngIf="isSuccess && confirmedBooking" class="success-screen">
          <div class="success-icon-badge">
            <span class="material-symbols-outlined">check_circle</span>
          </div>

          <h4 class="confirmed-heading">Thank you, {{ confirmedBooking.customerName }}!</h4>
          <p class="confirmed-sub">Your room reservation has been secured and confirmed.</p>

          <div class="ref-highlight-card">
            <span class="ref-label">Booking Reference</span>
            <span class="ref-code">{{ confirmedBooking.bookingReference }}</span>
            <span class="ref-note">Please save this reference code and your email to manage or cancel your reservation.</span>
          </div>

          <div class="voucher-details">
            <div class="detail-row">
              <span class="label">Destination:</span>
              <span class="val">{{ confirmedBooking.hotelName }}, {{ confirmedBooking.hotelCity }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Room:</span>
              <span class="val">{{ confirmedBooking.roomType }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Dates:</span>
              <span class="val">{{ confirmedBooking.checkInDate }} to {{ confirmedBooking.checkOutDate }} ({{ confirmedBooking.totalNights }} nights)</span>
            </div>
            <div class="detail-row total-highlight">
              <span class="label">Total Amount Paid:</span>
              <span class="val">₹{{ confirmedBooking.totalPrice | number:'1.2-2' }}</span>
            </div>
          </div>

          <div class="success-actions">
            <button class="btn btn-outline" (click)="printVoucher()">
              <span class="material-symbols-outlined">print</span>
              <span>Print Voucher</span>
            </button>
            <button class="btn btn-primary" (click)="goToManageBooking(confirmedBooking.bookingReference, confirmedBooking.customerEmail)">
              <span class="material-symbols-outlined">manage_search</span>
              <span>View in My Bookings</span>
            </button>
          </div>
        </div>

        <!-- Booking Form Screen -->
        <div *ngIf="!isSuccess" class="modal-body">
          <!-- Reservation Summary Box -->
          <div class="stay-summary-card">
            <div class="summary-col">
              <span class="summary-label">Check-in</span>
              <span class="summary-value">{{ checkInDate }}</span>
            </div>
            <div class="summary-divider">
              <span class="material-symbols-outlined">arrow_forward</span>
              <span class="nights-tag">{{ totalNights }} {{ totalNights === 1 ? 'night' : 'nights' }}</span>
            </div>
            <div class="summary-col">
              <span class="summary-label">Check-out</span>
              <span class="summary-value">{{ checkOutDate }}</span>
            </div>
          </div>

          <!-- Price Calculation Box (Calculated on server, previewed live) -->
          <div class="price-breakdown">
            <div class="price-row">
              <span>₹{{ room.pricePerNight | number:'1.2-2' }} × {{ totalNights }} {{ totalNights === 1 ? 'night' : 'nights' }}</span>
              <span>₹{{ (room.pricePerNight * totalNights) | number:'1.2-2' }}</span>
            </div>
            <div class="price-row text-muted">
              <span>Taxes & Service Fees (Included)</span>
              <span>₹0.00</span>
            </div>
            <div class="price-row total-row">
              <span>Total Estimated Amount</span>
              <span class="total-price">₹{{ (room.pricePerNight * totalNights) | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Customer Form -->
          <form (ngSubmit)="submitBooking()" #bookingForm="ngForm" class="customer-form">
            <div class="form-group">
              <label for="fullName">Guest Full Name *</label>
              <div class="input-wrapper">
                <span class="material-symbols-outlined icon">person</span>
                <input type="text"
                       id="fullName"
                       name="fullName"
                       [(ngModel)]="customerName"
                       required
                       minlength="2"
                       placeholder="e.g. Alice Walker"
                       class="form-control"
                       #nameCtrl="ngModel">
              </div>
              <small class="error-text" *ngIf="nameCtrl.invalid && (nameCtrl.dirty || nameCtrl.touched)">
                Please enter a valid guest name (at least 2 characters).
              </small>
            </div>

            <div class="form-group">
              <label for="email">Email Address *</label>
              <div class="input-wrapper">
                <span class="material-symbols-outlined icon">mail</span>
                <input type="email"
                       id="email"
                       name="email"
                       [(ngModel)]="customerEmail"
                       required
                       email
                       placeholder="e.g. alice.walker@example.com"
                       class="form-control"
                       #emailCtrl="ngModel">
              </div>
              <small class="error-text" *ngIf="emailCtrl.invalid && (emailCtrl.dirty || emailCtrl.touched)">
                Please enter a valid email address for confirmation.
              </small>
            </div>

            <!-- Error Banner -->
            <div *ngIf="errorMessage" class="error-banner animate-fade-in">
              <span class="material-symbols-outlined">error</span>
              <span>{{ errorMessage }}</span>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="close()">Cancel</button>
              <button type="submit"
                      class="btn btn-primary"
                      [disabled]="bookingForm.invalid || isLoading || totalNights < 1">
                <span *ngIf="!isLoading">Confirm & Reserve Room</span>
                <span *ngIf="isLoading" class="loading-state">
                  <span class="spinner"></span> Securing Reservation...
                </span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 20, 45, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 1rem;
    }

    .modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 540px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      padding: 20px 24px;
      background: var(--primary-color);
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.2;
    }

    .modal-subtitle {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 4px;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .modal-body {
      padding: 24px;
      overflow-y: auto;
    }

    .stay-summary-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--primary-light);
      padding: 14px 18px;
      border-radius: var(--radius-md);
      margin-bottom: 18px;
    }

    .summary-col {
      display: flex;
      flex-direction: column;
    }

    .summary-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }

    .summary-value {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .summary-divider {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--primary-color);
    }

    .nights-tag {
      font-size: 0.75rem;
      background: var(--accent-gold);
      color: var(--primary-color);
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
      margin-top: 2px;
    }

    .price-breakdown {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      padding: 14px 18px;
      border-radius: var(--radius-md);
      margin-bottom: 20px;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      margin-bottom: 6px;
    }

    .total-row {
      border-top: 1px dashed var(--border-color);
      margin-top: 10px;
      padding-top: 10px;
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--primary-color);
    }

    .total-price {
      color: var(--success-color);
    }

    .customer-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--text-dark);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrapper .icon {
      position: absolute;
      left: 12px;
      color: var(--text-light);
      pointer-events: none;
    }

    .form-control {
      width: 100%;
      padding: 12px 14px 12px 40px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      border-color: var(--border-focus);
    }

    .error-text {
      color: var(--danger-color);
      font-size: 0.78rem;
      margin-top: 4px;
      display: block;
    }

    .error-banner {
      background: var(--danger-bg);
      color: var(--danger-color);
      padding: 12px;
      border-radius: var(--radius-md);
      font-size: 0.88rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }

    .btn {
      padding: 11px 20px;
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-secondary {
      background: #e2e8f0;
      color: var(--text-dark);
    }

    .btn-secondary:hover {
      background: #cbd5e1;
    }

    .btn-primary {
      background: var(--primary-color);
      color: #ffffff;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-hover);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-dark);
    }

    .btn-outline:hover {
      background: #f1f5f9;
    }

    /* Success Screen */
    .success-screen {
      padding: 32px 24px;
      text-align: center;
      overflow-y: auto;
    }

    .success-icon-badge {
      width: 64px;
      height: 64px;
      background: var(--success-bg);
      color: var(--success-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .success-icon-badge .material-symbols-outlined {
      font-size: 38px;
    }

    .confirmed-heading {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--primary-color);
    }

    .confirmed-sub {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-top: 4px;
      margin-bottom: 20px;
    }

    .ref-highlight-card {
      background: var(--accent-gold-light);
      border: 2px dashed var(--accent-gold);
      padding: 16px;
      border-radius: var(--radius-md);
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .ref-label {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #855d00;
    }

    .ref-code {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--primary-color);
      letter-spacing: 1px;
    }

    .ref-note {
      font-size: 0.78rem;
      color: #855d00;
    }

    .voucher-details {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 16px;
      margin-bottom: 24px;
      text-align: left;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.88rem;
      margin-bottom: 8px;
    }

    .detail-row .label {
      color: var(--text-muted);
      font-weight: 500;
    }

    .detail-row .val {
      font-weight: 700;
      color: var(--text-dark);
      text-align: right;
    }

    .total-highlight {
      border-top: 1px solid var(--border-color);
      padding-top: 8px;
      margin-top: 8px;
      font-size: 1rem;
    }

    .total-highlight .val {
      color: var(--success-color);
    }

    .success-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class BookingModalComponent {
  @Input({ required: true }) hotel!: HotelDetail;
  @Input({ required: true }) room!: Room;
  @Input({ required: true }) checkInDate!: string;
  @Input({ required: true }) checkOutDate!: string;
  @Input({ required: true }) totalNights!: number;

  @Output() closeEvent = new EventEmitter<boolean>();

  private bookingService = inject(BookingService);
  private router = inject(Router);

  customerName: string = '';
  customerEmail: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  isSuccess: boolean = false;
  confirmedBooking: BookingResponse | null = null;

  submitBooking(): void {
    if (!this.customerName.trim() || !this.customerEmail.trim()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload: CreateBookingRequest = {
      roomId: this.room.id,
      customerName: this.customerName.trim(),
      customerEmail: this.customerEmail.trim(),
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate
    };

    this.bookingService.createBooking(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.confirmedBooking = response;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 409) {
          this.errorMessage = 'Sorry, this room is no longer available for the selected dates (overbooking prevented).';
        } else {
          this.errorMessage = 'An error occurred while creating your reservation. Please try again.';
        }
      }
    });
  }

  printVoucher(): void {
    window.print();
  }

  goToManageBooking(reference: string, email: string): void {
    this.closeEvent.emit(true);
    this.router.navigate(['/manage-booking'], {
      queryParams: { reference, email }
    });
  }

  close(): void {
    this.closeEvent.emit(this.isSuccess);
  }

  onBackdropClick(event: MouseEvent): void {
    this.close();
  }
}
