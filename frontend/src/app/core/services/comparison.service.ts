import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HotelSummary } from '../models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class ComparisonService {
  private readonly MAX_COMPARISON = 3;
  private selectedHotelsSubject = new BehaviorSubject<HotelSummary[]>([]);
  public selectedHotels$ = this.selectedHotelsSubject.asObservable();

  private isModalOpenSubject = new BehaviorSubject<boolean>(false);
  public isModalOpen$ = this.isModalOpenSubject.asObservable();

  get currentHotels(): HotelSummary[] {
    return this.selectedHotelsSubject.value;
  }

  isSelected(hotelId: number): boolean {
    return this.selectedHotelsSubject.value.some(h => h.id === hotelId);
  }

  toggleHotel(hotel: HotelSummary): { added: boolean; limitReached: boolean } {
    const current = [...this.selectedHotelsSubject.value];
    const index = current.findIndex(h => h.id === hotel.id);

    if (index >= 0) {
      current.splice(index, 1);
      this.selectedHotelsSubject.next(current);
      return { added: false, limitReached: false };
    } else {
      if (current.length >= this.MAX_COMPARISON) {
        return { added: false, limitReached: true };
      }
      current.push(hotel);
      this.selectedHotelsSubject.next(current);
      return { added: true, limitReached: false };
    }
  }

  removeHotel(hotelId: number): void {
    const current = this.selectedHotelsSubject.value.filter(h => h.id !== hotelId);
    this.selectedHotelsSubject.next(current);
  }

  clearAll(): void {
    this.selectedHotelsSubject.next([]);
  }

  openModal(): void {
    if (this.selectedHotelsSubject.value.length >= 2) {
      this.isModalOpenSubject.next(true);
    }
  }

  closeModal(): void {
    this.isModalOpenSubject.next(false);
  }
}
