import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HotelService } from '../../core/services/hotel.service';
import { ComparisonService } from '../../core/services/comparison.service';
import { ToastService } from '../../core/services/toast.service';
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
            Discover premier luxury hotels across Mumbai, Varanasi, Pune, Jaipur, Goa & New Delhi with guaranteed rates (₹2,000 – ₹3,000).
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
                         placeholder="e.g. Mumbai, Varanasi, Pune, Jaipur, Goa..."
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

      <!-- Main Layout: Sidebar Filters + Hotel Catalog Grid -->
      <section class="container catalog-section">
        
        <!-- Results Bar: Counts + Sorting Dropdown -->
        <div class="results-header">
          <div>
            <h2 class="section-title">Available Accommodations</h2>
            <p class="section-sub">
              Showing {{ hotels.length }} luxury property{{ hotels.length === 1 ? '' : 'ies' }}
              <span *ngIf="activeSearchCity"> in <strong>"{{ activeSearchCity }}"</strong></span>
            </p>
          </div>

          <div class="header-right-controls">
            <!-- Sorting Control -->
            <div class="sort-wrapper">
              <label for="sortSelect">
                <span class="material-symbols-outlined">sort</span>
                Sort by:
              </label>
              <select id="sortSelect" [(ngModel)]="sortBy" (change)="applyFilters()" class="sort-select">
                <option value="">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated (★)</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>

            <div class="compare-info-tag" *ngIf="comparisonService.currentHotels.length > 0">
              <span class="material-symbols-outlined">compare_arrows</span>
              <span>{{ comparisonService.currentHotels.length }}/3 for comparison</span>
            </div>
          </div>
        </div>

        <div class="catalog-layout">
          
          <!-- Left Sidebar Filters -->
          <aside class="filters-sidebar">
            <div class="sidebar-header">
              <div class="sidebar-title">
                <span class="material-symbols-outlined">tune</span>
                <span>Filters</span>
              </div>
              <button class="reset-filters-btn" (click)="resetFilters()" *ngIf="hasActiveFilters()">
                Reset
              </button>
            </div>

            <!-- Price Range Filter -->
            <div class="filter-group">
              <label class="filter-title">
                Max Price per Night: <strong>₹{{ maxPriceFilter | number:'1.0-0' }}</strong>
              </label>
              <input type="range"
                     min="2000"
                     max="3000"
                     step="100"
                     [(ngModel)]="maxPriceFilter"
                     (input)="applyFilters()"
                     class="price-slider">
              <div class="slider-labels">
                <span>₹2,000</span>
                <span>₹2,500</span>
                <span>₹3,000</span>
              </div>
            </div>

            <!-- Star Rating Filter -->
            <div class="filter-group">
              <span class="filter-title">Guest Rating</span>
              <div class="rating-options">
                <button type="button"
                        class="rating-opt-btn"
                        [class.active]="minRatingFilter === 0"
                        (click)="setRatingFilter(0)">
                  All
                </button>
                <button type="button"
                        class="rating-opt-btn"
                        [class.active]="minRatingFilter === 4.7"
                        (click)="setRatingFilter(4.7)">
                  ★ 4.7+
                </button>
                <button type="button"
                        class="rating-opt-btn"
                        [class.active]="minRatingFilter === 4.8"
                        (click)="setRatingFilter(4.8)">
                  ★ 4.8+
                </button>
                <button type="button"
                        class="rating-opt-btn"
                        [class.active]="minRatingFilter === 4.9"
                        (click)="setRatingFilter(4.9)">
                  ★ 4.9
                </button>
              </div>
            </div>

            <!-- Amenities Filter -->
            <div class="filter-group">
              <span class="filter-title">Popular Amenities</span>
              <div class="amenity-checkbox-list">
                <label *ngFor="let am of availableAmenities" class="checkbox-label">
                  <input type="radio"
                         name="amenityFilter"
                         [value]="am.keyword"
                         [(ngModel)]="selectedAmenityKeyword"
                         (change)="applyFilters()">
                  <span class="material-symbols-outlined am-icon">{{ am.icon }}</span>
                  <span>{{ am.label }}</span>
                </label>
                <label class="checkbox-label" *ngIf="selectedAmenityKeyword">
                  <input type="radio"
                         name="amenityFilter"
                         value=""
                         [(ngModel)]="selectedAmenityKeyword"
                         (change)="applyFilters()">
                  <span class="am-icon material-symbols-outlined">clear_all</span>
                  <span class="clear-amenity">Clear Amenity</span>
                </label>
              </div>
            </div>

            <!-- Quick Info Card -->
            <div class="internship-badge-card">
              <span class="material-symbols-outlined">verified_user</span>
              <div>
                <strong>Overbooking Protection</strong>
                <p>Protected by database row-level locking & instant inventory recovery.</p>
              </div>
            </div>

          </aside>

          <!-- Right: Hotel Cards Grid -->
          <main class="hotel-main-area">
            
            <!-- Loading State -->
            <div *ngIf="isLoading" class="state-container">
              <div class="spinner-large"></div>
              <p>Curating exceptional accommodations for your journey...</p>
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
              <h3>No hotels match your filters</h3>
              <p>Try resetting the price, rating, or amenity filters to view all accommodations.</p>
              <button class="btn-retry" (click)="resetFilters()">Clear All Filters</button>
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

          </main>

        </div>

      </section>

    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #001f3f 0%, #003366 50%, #004080 100%);
      color: #ffffff;
      padding: 50px 0 70px;
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
      margin-bottom: 14px;
    }

    .hero-title {
      font-size: 2.3rem;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.2;
      max-width: 800px;
      margin-bottom: 12px;
    }

    .hero-subtitle {
      font-size: 1.05rem;
      color: #cbd5e1;
      max-width: 650px;
      line-height: 1.6;
      margin-bottom: 30px;
    }

    /* Search Box Card */
    .search-box-card {
      background: #ffffff;
      border-radius: var(--radius-lg);
      padding: 22px;
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

    /* Catalog Layout */
    .catalog-section {
      padding: 36px 1.5rem 60px;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 16px;
      flex-wrap: wrap;
      gap: 16px;
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

    .header-right-controls {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .sort-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-dark);
    }

    .sort-wrapper label {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .sort-wrapper label .material-symbols-outlined {
      font-size: 18px;
      color: var(--primary-color);
    }

    .sort-select {
      padding: 8px 12px;
      border-radius: var(--radius-md);
      border: 1.5px solid var(--border-color);
      background: #ffffff;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-dark);
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

    .catalog-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 30px;
      align-items: flex-start;
    }

    /* Filters Sidebar */
    .filters-sidebar {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 22px;
      box-shadow: var(--shadow-sm);
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 12px;
    }

    .sidebar-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--primary-color);
    }

    .reset-filters-btn {
      background: transparent;
      color: var(--danger-color);
      font-size: 0.8rem;
      font-weight: 700;
    }

    .reset-filters-btn:hover {
      text-decoration: underline;
    }

    .filter-group {
      margin-bottom: 22px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 18px;
    }

    .filter-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 10px;
      display: block;
    }

    .price-slider {
      width: 100%;
      margin: 8px 0;
      accent-color: var(--primary-color);
    }

    .slider-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .rating-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .rating-opt-btn {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 6px 10px;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-dark);
      text-align: center;
      transition: all 0.2s;
    }

    .rating-opt-btn:hover {
      background: var(--primary-light);
      border-color: var(--primary-color);
    }

    .rating-opt-btn.active {
      background: var(--primary-color);
      color: #ffffff;
      border-color: var(--primary-color);
    }

    .amenity-checkbox-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
    }

    .checkbox-label input {
      accent-color: var(--primary-color);
    }

    .am-icon {
      font-size: 16px;
      color: var(--primary-color);
    }

    .clear-amenity {
      color: var(--danger-color);
      font-size: 0.8rem;
    }

    .internship-badge-card {
      background: var(--primary-light);
      border-radius: var(--radius-md);
      padding: 12px;
      display: flex;
      gap: 8px;
      align-items: flex-start;
      margin-top: 10px;
    }

    .internship-badge-card .material-symbols-outlined {
      color: var(--primary-color);
      font-size: 20px;
      flex-shrink: 0;
    }

    .internship-badge-card strong {
      display: block;
      font-size: 0.8rem;
      color: var(--primary-color);
      margin-bottom: 2px;
    }

    .internship-badge-card p {
      font-size: 0.72rem;
      color: #475569;
      line-height: 1.3;
    }

    /* Main Area & Hotel Grid */
    .hotel-main-area {
      min-width: 0;
    }

    .hotel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 24px;
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
      height: 200px;
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
      top: 12px;
      right: 12px;
      background: #ffffff;
      color: var(--text-dark);
      padding: 4px 10px;
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
      bottom: 12px;
      left: 12px;
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
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .hotel-name {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--primary-color);
      line-height: 1.3;
      margin-bottom: 6px;
    }

    .hotel-address {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 10px;
    }

    .hotel-address .material-symbols-outlined {
      font-size: 15px;
    }

    .hotel-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 14px;
    }

    .amenity-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 18px;
    }

    .amenity-tag {
      background: #f1f5f9;
      color: #475569;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 3px 7px;
      border-radius: 5px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }

    .amenity-tag .material-symbols-outlined {
      font-size: 13px;
      color: var(--primary-color);
    }

    .amenity-more {
      font-size: 0.72rem;
      color: var(--text-light);
      align-self: center;
    }

    .card-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-color);
      padding-top: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .price-prefix {
      font-size: 0.72rem;
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
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--primary-color);
    }

    .price-val .unit {
      font-size: 0.75rem;
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
      padding: 7px 10px;
      border-radius: var(--radius-md);
      font-size: 0.78rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 3px;
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
      padding: 8px 12px;
      border-radius: var(--radius-md);
      font-size: 0.82rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 3px;
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

    @media (max-width: 960px) {
      .catalog-layout {
        grid-template-columns: 1fr;
      }
      .search-grid {
        grid-template-columns: 1fr 1fr;
      }
      .search-action {
        grid-column: span 2;
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
  private toastService = inject(ToastService);

  hotels: HotelSummary[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  searchCity: string = '';
  activeSearchCity: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';

  minCheckInDate: string = '';
  minCheckOutDate: string = '';

  // Filter & Sort State
  maxPriceFilter: number = 3000;
  minRatingFilter: number = 0;
  selectedAmenityKeyword: string = '';
  sortBy: string = '';

  popularCities: string[] = ['Mumbai', 'Varanasi', 'Pune', 'Jaipur', 'Goa', 'New Delhi'];

  availableAmenities = [
    { label: 'Swimming Pool', keyword: 'pool', icon: 'pool' },
    { label: 'Wellness Spa', keyword: 'spa', icon: 'spa' },
    { label: 'Gourmet Breakfast', keyword: 'breakfast', icon: 'restaurant' },
    { label: 'Free Wi-Fi', keyword: 'wifi', icon: 'wifi' },
    { label: 'Airport Shuttle', keyword: 'shuttle', icon: 'airport_shuttle' },
    { label: 'Valet Parking', keyword: 'parking', icon: 'local_parking' }
  ];

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

    const minRating = this.minRatingFilter > 0 ? this.minRatingFilter : undefined;
    const maxPrice = this.maxPriceFilter < 3000 ? this.maxPriceFilter : undefined;
    const amenity = this.selectedAmenityKeyword || undefined;
    const sort = this.sortBy || undefined;

    this.hotelService.searchHotels(
      this.searchCity,
      this.checkInDate,
      this.checkOutDate,
      undefined,
      maxPrice,
      minRating,
      amenity,
      sort
    ).subscribe({
      next: (data) => {
        this.hotels = data;
        this.activeSearchCity = this.searchCity;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load hotels. Please make sure the Spring Boot server is running on port 8080.';
      }
    });
  }

  onSearch(): void {
    this.loadHotels();
  }

  applyFilters(): void {
    this.loadHotels();
  }

  setRatingFilter(rating: number): void {
    this.minRatingFilter = rating;
    this.applyFilters();
  }

  resetFilters(): void {
    this.maxPriceFilter = 3000;
    this.minRatingFilter = 0;
    this.selectedAmenityKeyword = '';
    this.sortBy = '';
    this.searchCity = '';
    this.loadHotels();
    this.toastService.info('All filters reset.');
  }

  hasActiveFilters(): boolean {
    return this.maxPriceFilter < 3000 ||
           this.minRatingFilter > 0 ||
           !!this.selectedAmenityKeyword ||
           !!this.sortBy ||
           !!this.searchCity;
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
      this.toastService.warning('You can compare up to 3 hotels at a time. Deselect one first.');
    } else if (result.added) {
      this.toastService.success(`Added "${hotel.name}" to comparison (${this.comparisonService.currentHotels.length}/3).`);
    } else {
      this.toastService.info(`Removed "${hotel.name}" from comparison.`);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
