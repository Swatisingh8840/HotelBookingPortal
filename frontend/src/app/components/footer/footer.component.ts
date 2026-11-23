import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer-wrapper">
      <div class="container footer-content">
        <div class="footer-grid">
          <div class="footer-col brand-col">
            <div class="brand-line">
              <span class="tc-logo-badge">TC</span>
              <span class="tc-logo-name">Thomas Cook</span>
            </div>
            <p class="brand-desc">
              Developer Internship Assessment Project. Engineered with Angular 19, Java Spring Boot 3, and MySQL 8.0, featuring enterprise concurrency locking and side-by-side comparison.
            </p>
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">Destinations</h4>
            <ul class="footer-list">
              <li>London, United Kingdom</li>
              <li>Paris, France</li>
              <li>Dubai, United Arab Emirates</li>
              <li>Tokyo, Japan</li>
              <li>Zurich, Switzerland</li>
              <li>New York, United States</li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">Core Architecture</h4>
            <ul class="footer-list">
              <li>Pessimistic Concurrency Locking</li>
              <li>Strict Date Overlap Prevention</li>
              <li>Automated Dynamic Pricing</li>
              <li>Instant Inventory Restoration</li>
              <li>Side-by-Side Hotel Matrix</li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 Thomas Cook Developer Assessment. All rights reserved.</p>
          <div class="tech-pills">
            <span class="tech-pill">Angular 19</span>
            <span class="tech-pill">Spring Boot 3</span>
            <span class="tech-pill">MySQL 8</span>
            <span class="tech-pill">JUnit 5 & Mockito</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-wrapper {
      background-color: #001f3f;
      color: #94a3b8;
      padding: 60px 0 30px;
      margin-top: 80px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1.5fr;
      gap: 40px;
      margin-bottom: 40px;
    }

    .brand-line {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }

    .tc-logo-badge {
      background-color: var(--accent-gold);
      color: var(--primary-color);
      font-weight: 800;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
    }

    .tc-logo-name {
      color: #ffffff;
      font-size: 1.2rem;
      font-weight: 700;
    }

    .brand-desc {
      font-size: 0.9rem;
      line-height: 1.6;
      color: #cbd5e1;
      max-width: 440px;
    }

    .footer-heading {
      color: #ffffff;
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 16px;
      letter-spacing: 0.2px;
    }

    .footer-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.88rem;
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 24px;
      font-size: 0.85rem;
      flex-wrap: wrap;
      gap: 16px;
    }

    .tech-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tech-pill {
      background-color: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
      .footer-bottom {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class FooterComponent {}
