import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ComparisonDrawerComponent } from './components/comparison-drawer/comparison-drawer.component';
import { ComparisonModalComponent } from './components/comparison-modal/comparison-modal.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ComparisonDrawerComponent,
    ComparisonModalComponent,
    ToastComponent
  ],
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      <app-toast></app-toast>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      <app-comparison-drawer></app-comparison-drawer>
      <app-comparison-modal></app-comparison-modal>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
    }
  `]
})
export class AppComponent {
  title = 'Thomas Cook Hotel Booking Portal';
}
