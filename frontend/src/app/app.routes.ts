import { Routes } from '@angular/router';
import { HotelListComponent } from './components/hotel-list/hotel-list.component';
import { HotelDetailComponent } from './components/hotel-detail/hotel-detail.component';
import { ManageBookingComponent } from './components/manage-booking/manage-booking.component';

export const routes: Routes = [
  { path: '', component: HotelListComponent },
  { path: 'hotel/:id', component: HotelDetailComponent },
  { path: 'manage-booking', component: ManageBookingComponent },
  { path: '**', redirectTo: '' }
];
