import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelSummary, HotelDetail, HotelComparison } from '../models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/hotels';

  searchHotels(
    city?: string,
    checkIn?: string,
    checkOut?: string,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
    amenity?: string,
    sortBy?: string
  ): Observable<HotelSummary[]> {
    let params = new HttpParams();
    if (city && city.trim()) {
      params = params.set('city', city.trim());
    }
    if (checkIn) {
      params = params.set('checkIn', checkIn);
    }
    if (checkOut) {
      params = params.set('checkOut', checkOut);
    }
    if (minPrice != null) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice != null) {
      params = params.set('maxPrice', maxPrice.toString());
    }
    if (minRating != null) {
      params = params.set('minRating', minRating.toString());
    }
    if (amenity && amenity.trim()) {
      params = params.set('amenity', amenity.trim());
    }
    if (sortBy && sortBy.trim()) {
      params = params.set('sortBy', sortBy.trim());
    }

    return this.http.get<HotelSummary[]>(this.apiUrl, { params });
  }

  getHotelDetails(id: number, checkIn?: string, checkOut?: string): Observable<HotelDetail> {
    let params = new HttpParams();
    if (checkIn) {
      params = params.set('checkIn', checkIn);
    }
    if (checkOut) {
      params = params.set('checkOut', checkOut);
    }

    return this.http.get<HotelDetail>(`${this.apiUrl}/${id}`, { params });
  }

  compareHotels(hotelIds: number[]): Observable<HotelComparison[]> {
    let params = new HttpParams().set('hotelIds', hotelIds.join(','));
    return this.http.get<HotelComparison[]>(`${this.apiUrl}/compare`, { params });
  }
}
