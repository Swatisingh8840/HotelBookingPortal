import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingResponse, CreateBookingRequest, CancelBookingRequest } from '../models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/bookings';

  createBooking(request: CreateBookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.apiUrl, request);
  }

  lookupBooking(reference: string, email: string): Observable<BookingResponse> {
    const params = new HttpParams()
      .set('reference', reference.trim())
      .set('email', email.trim());

    return this.http.get<BookingResponse>(`${this.apiUrl}/lookup`, { params });
  }

  cancelBooking(reference: string, email: string): Observable<BookingResponse> {
    const body: CancelBookingRequest = { customerEmail: email.trim() };
    return this.http.post<BookingResponse>(`${this.apiUrl}/${reference.trim()}/cancel`, body);
  }
}
