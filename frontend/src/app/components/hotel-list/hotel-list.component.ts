import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HotelService } from '../../core/services/hotel.service';
import { ComparisonService } from '../../core/services/comparison.service';
import { HotelSummary } from '../../core/models/hotel.model';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="hotel-list-page">
      
      <!-- Hero Banner & Search Engine -->
      <section class="hero-section">
        <div class="container hero-content">
          <div class="hero-badge">
            <span class="material-symbols-outlined">stars</span>
            <span>Thomas Cook Curated Collection</span>
          </div>
          <h1 class="hero-title">Experience Unmatched Luxury & World-Class Hospitality</h1>
          <p class="hero-subtitle">
            Discover premier hotels and exclusive suites across the globe. Guaranteed best rates and instant booking confirmation.
          </p>

          <!-- Search Card -->
          <div class="search-box-card">
            <form (ngSubmit)="onSearch()" class="search-grid">
              
              <!-- Location Input -->
              <div class="search-field">
                <label for="citySearch">Destination</label>
                <div class="input-inner">
                  <span class="material-symbols-outlined icon">location_on</span>
                  <input type="text"
                         id="citySearch"
                         [(ngModel)]="searchCity"
                         name="city"
                         placeholder="e.g. Mumbai, Varanasi, Pune..."
                         class="search-input">
                </div>
              </div>

              <!-- Check-In Date -->
              <div class="search-field">
                <label for="checkIn">Check-in Date</label>
                <div class="input-inner">
                  <span class="material-symbols-outlined icon">calendar_today</span>
                  <input type="date"
                         id="checkIn"
                         [(ngModel)]="checkInDate"
                         name="checkIn"
                         [min]="minCheckInDate"
                         (change)="onCheckInChange()"
                         class="search-input">
                </div>
              </div>

              <!-- Check-Out Date -->
              <div class="search-field">
                <label for="checkOut">Check-out Date</label>
                <div class="input-inner">
                  <span class="material-symbols-outlined icon">event</span>
                  <input type="date"
                         id="checkOut"
                         [(ngModel)]="checkOutDate"
                         name="checkOut"
                         [min]="minCheckOutDate"
                         class="search-input">
                </div>
              </div>

              <!-- Search CTA Button -->
              <div class="search-action">
                <button type="submit" class="search-btn">
                  <span class="material-symbols-outlined">search</span>
                  <span>Search Hotels</span>
                </button>
              </div>

            </form>

            <!-- Popular Quick Filter Chips -->
            <div class="popular-destinations">
              <span class="pop-label">Popular Destinations:</span>
              <button *ngFor="let dest of popularCities"
                      type="button"
                      class="city-chip"
                      [class.active]="searchCity.toLowerCase() === dest.toLowerCase()"
                      (click)="selectCity(dest)">
                {{ dest }}
              </button>
              <button *ngIf="searchCity"
                      type="button"
                      class="clear-chip"
                      (click)="clearSearch()">
                Clear Filter ✕
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Hotel Catalog Section -->
      <section class="container catalog-section">
        
        <!-- Results Header -->
        <div class="results-header">
          <div>
            <h2 class="section-title">Available Accommodations</h2>
            <p class="section-sub">
              Showing {{ hotels.length }} hotel{{ hotels.length === 1 ? '' : 's' }}
              <span *ngIf="activeSearchCity"> in <strong>"{{ activeSearchCity }}"</strong></span>
            </p>
          </div>

          <div class="compare-info-tag" *ngIf="comparisonService.currentHotels.length > 0">
            <span class="material-symbols-outlined">compare_arrows</span>
            <span>{{ comparisonService.currentHotels.length }}/3 selected for comparison</span>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="state-container">
          <div class="spinner-large"></div>
          <p>Curating exceptional hotels for your journey...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="!isLoading && errorMessage" class="state-container error-state">
          <span class="material-symbols-outlined state-icon">error_outline</span>
          <h3>Unable to fetch hotels</h3>
          <p>{{ errorMessage }}</p>
          <button class="btn-retry" (click)="loadHotels()">Retry</button>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && !errorMessage && hotels.length === 0" class="state-container">
          <span class="material-symbols-outlined state-icon">hotel_class</span>
          <h3>No hotels found matching "{{ activeSearchCity }}"</h3>
          <p>Try searching for London, Paris, Dubai, Tokyo, Zurich, or New York.</p>
          <button class="btn-retry" (click)="clearSearch()">View All Hotels</button>
        </div>

        <!-- Hotel Grid -->
        <div *ngIf="!isLoading && hotels.length > 0" class="hotel-grid">
          <div *ngFor="let hotel of hotels" class="hotel-card animate-fade-in">
            
            <!-- Image & Badges -->
            <div class="card-image-wrap">
              <img [src]="hotel.imageUrl" [alt]="hotel.name" class="hotel-img" loading="lazy">
              
              <div class="rating-badge">
                <span class="material-symbols-outlined star-icon">star</span>
                <span>{{ hotel.rating | number:'1.1-1' }}</span>
              </div>

              <div class="location-chip">
                <span class="material-symbols-outlined">location_on</span>
                <span>{{ hotel.city }}</span>
              </div>
            </div>

            <!-- Card Content -->
            <div class="card-content">
              <h3 class="hotel-name">{{ hotel.name }}</h3>
              <p class="hotel-address">
                <span class="material-symbols-outlined">map</span>
                <span>{{ hotel.address }}</span>
              </p>

              <p class="hotel-desc">{{ hotel.description }}</p>

              <!-- Amenity Icons -->
              <div class="amenity-tags">
                <span *ngFor="let amenity of hotel.amenities.slice(0, 4)" class="amenity-tag" [title]="amenity.name">
                  <span class="material-symbols-outlined">{{ amenity.iconCode || 'check' }}</span>
                  <span>{{ amenity.name }}</span>
                </span>
                <span *ngIf="hotel.amenities.length > 4" class="amenity-more">
                  +{{ hotel.amenities.length - 4 }} more
                </span>
              </div>

              <!-- Price & Actions Footer -->
              <div class="card-footer">
                <div class="price-box">
                  <span class="price-prefix">From</span>
                  <div class="price-val">
                    <span class="currency">₹</span>
                    <span class="amount">{{ hotel.startingPrice | number:'1.0-0' }}</span>
                    <span class="unit">/ night</span>
                  </div>
                </div>

                <div class="action-buttons">
                  <!-- Surprise Feature: Compare Toggle -->
                  <button type="button"
                          class="btn-compare"
                          [class.selected]="comparisonService.isSelected(hotel.id)"
                          (click)="onToggleCompare(hotel)">
                    <span class="material-symbols-outlined">
                      {{ comparisonService.isSelected(hotel.id) ? 'check_box' : 'add_circle_outline' }}
                    </span>
                    <span>{{ comparisonService.isSelected(hotel.id) ? 'Comparing' : 'Compare' }}</span>
                  </button>

                  <a [routerLink]="['/hotel', hotel.id]"
                     [queryParams]="{ checkIn: checkInDate, checkOut: checkOutDate }"
                     class="btn-view">
                    <span>View Rooms</span>
                    <span class="material-symbols-outlined">arrow_forward</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #001f3f 0%, #003366 50%, #004080 100%);
      color: #ffffff;
      padding: 60px 0 80px;
      position: relative;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(245, 178, 27, 0.15);
      border: 1px solid var(--accent-gold);
      color: var(--accent-gold);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.2;
      max-width: 800px;
      margin-bottom: 14px;
    }

    .hero-subtitle {
      font-size: 1.05rem;
      color: #cbd5e1;
      max-width: 650px;
      line-height: 1.6;
      margin-bottom: 36px;
    }

    /* Search Box Card */
    .search-box-card {
      background: #ffffff;
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: 0 15px 35px rgba(0, 20, 50, 0.25);
      width: 100%;
      max-width: 1040px;
      text-align: left;
    }

    .search-grid {
      display: grid;
      grid-template-columns: 2fr 1.3fr 1.3fr 1.4fr;
      gap: 16px;
      align-items: flex-end;
    }

    .search-field label {
      display: block;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .input-inner {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-inner .icon {
      position: absolute;
      left: 12px;
      color: var(--primary-color);
      pointer-events: none;
    }

    .search-input {
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

    .search-input:focus {
      border-color: var(--primary-color);
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.1);
    }

    .search-btn {
      width: 100%;
      height: 48px;
      background: var(--accent-gold);
      color: var(--primary-color);
      font-size: 1rem;
      font-weight: 800;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(245, 178, 27, 0.35);
    }

    .search-btn:hover {
      background: var(--accent-gold-hover);
      transform: translateY(-1px);
    }

    /* Popular Destinations */
    .popular-destinations {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 18px;
      flex-wrap: wrap;
    }

    .pop-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .city-chip {
      background: #f1f5f9;
      color: var(--text-dark);
      padding: 5px 12px;
      border-radius: 16px;
      font-size: 0.82rem;
      font-weight: 600;
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .city-chip:hover {
      background: var(--primary-light);
      color: var(--primary-color);
    }

    .city-chip.active {
      background: var(--primary-color);
      color: #ffffff;
    }

    .clear-chip {
      background: var(--danger-bg);
      color: var(--danger-color);
      padding: 5px 10px;
      border-radius: 16px;
      font-size: 0.78rem;
      font-weight: 600;
    }

    /* Catalog Section */
    .catalog-section {
      padding: 40px 1.5rem 60px;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 28px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 16px;
    }

    .section-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-dark);
    }

    .section-sub {
      color: var(--text-muted);
      font-size: 0.92rem;
      margin-top: 4px;
    }

    .compare-info-tag {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--accent-gold-light);
      color: #855d00;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      border: 1px solid var(--accent-gold);
    }

    /* Hotel Grid */
    .hotel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 30px;
    }

    .hotel-card {
      background: #ffffff;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .hotel-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .card-image-wrap {
      position: relative;
      height: 220px;
      overflow: hidden;
      background: #e2e8f0;
    }

    .hotel-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .hotel-card:hover .hotel-img {
      transform: scale(1.04);
    }

    .rating-badge {
      position: absolute;
      top: 14px;
      right: 14px;
      background: #ffffff;
      color: var(--text-dark);
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 4px;
      box-shadow: var(--shadow-md);
    }

    .star-icon {
      color: #f59e0b;
      font-size: 16px;
    }

    .location-chip {
      position: absolute;
      bottom: 14px;
      left: 14px;
      background: rgba(0, 32, 64, 0.75);
      backdrop-filter: blur(4px);
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 14px;
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .location-chip .material-symbols-outlined {
      font-size: 16px;
    }

    .card-content {
      padding: 22px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .hotel-name {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary-color);
      line-height: 1.3;
      margin-bottom: 6px;
    }

    .hotel-address {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .hotel-address .material-symbols-outlined {
      font-size: 15px;
    }

    .hotel-desc {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 16px;
    }

    .amenity-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 20px;
    }

    .amenity-tag {
      background: #f1f5f9;
      color: #475569;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .amenity-tag .material-symbols-outlined {
      font-size: 14px;
      color: var(--primary-color);
    }

    .amenity-more {
      font-size: 0.75rem;
      color: var(--text-light);
      align-self: center;
    }

    .card-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-color);
      padding-top: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .price-prefix {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      display: block;
    }

    .price-val {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .price-val .currency {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-dark);
    }

    .price-val .amount {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--primary-color);
    }

    .price-val .unit {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-compare {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 8px 12px;
      border-radius: var(--radius-md);
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .btn-compare.selected {
      background: var(--accent-gold-light);
      border-color: var(--accent-gold);
      color: #855d00;
      font-weight: 700;
    }

    .btn-view {
      background: var(--primary-color);
      color: #ffffff;
      padding: 9px 14px;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .btn-view:hover {
      background: var(--primary-hover);
    }

    /* States */
    .state-container {
      text-align: center;
      padding: 60px 20px;
      background: #ffffff;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
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

    .state-icon {
      font-size: 48px;
      color: var(--text-light);
      margin-bottom: 12px;
    }

    .btn-retry {
      background: var(--primary-color);
      color: #ffffff;
      padding: 8px 18px;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-weight: 600;
      margin-top: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 900px) {
      .search-grid {
        grid-template-columns: 1fr 1fr;
      }
      .search-action {
        grid-column: span 2;
      }
      .hero-title {
        font-size: 2rem;
      }
    }

    @media (max-width: 600px) {
      .search-grid {
        grid-template-columns: 1fr;
      }
      .search-action {
        grid-column: span 1;
      }
    }
  `]
})
export class HotelListComponent implements OnInit {
  private hotelService = inject(HotelService);
  public comparisonService = inject(ComparisonService);

  hotels: HotelSummary[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  searchCity: string = '';
  activeSearchCity: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';

  minCheckInDate: string = '';
  minCheckOutDate: string = '';

  popularCities: string[] = ['Mumbai', 'Varanasi', 'Pune'];

  ngOnInit(): void {
    const today = new Date();
    this.minCheckInDate = this.formatDate(today);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    this.minCheckOutDate = this.formatDate(tomorrow);

    this.checkInDate = this.minCheckInDate;
    this.checkOutDate = this.minCheckOutDate;

    this.loadHotels();
  }

  loadHotels(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.hotelService.searchHotels(this.searchCity, this.checkInDate, this.checkOutDate).subscribe({
      next: (data) => {
        this.hotels = data;
        this.activeSearchCity = this.searchCity;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load hotels. Please make sure the Spring Boot server is running on port 8080.';
      }
    });
  }

  onSearch(): void {
    this.loadHotels();
  }

  selectCity(city: string): void {
    this.searchCity = city;
    this.loadHotels();
  }

  clearSearch(): void {
    this.searchCity = '';
    this.loadHotels();
  }

  onCheckInChange(): void {
    if (this.checkInDate) {
      const nextDay = new Date(this.checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      this.minCheckOutDate = this.formatDate(nextDay);

      if (this.checkOutDate <= this.checkInDate) {
        this.checkOutDate = this.minCheckOutDate;
      }
    }
  }

  onToggleCompare(hotel: HotelSummary): void {
    const result = this.comparisonService.toggleHotel(hotel);
    if (result.limitReached) {
      alert('You can compare up to 3 hotels at a time. Please deselect one hotel first to add another.');
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
