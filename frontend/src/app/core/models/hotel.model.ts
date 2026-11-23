export interface Amenity {
  id: number;
  name: string;
  iconCode: string;
}

export interface Room {
  id: number;
  roomType: string;
  pricePerNight: number;
  totalInventory: number;
  availableRooms?: number;
  maxOccupancy: number;
  description: string;
}

export interface HotelSummary {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  rating: number;
  imageUrl: string;
  startingPrice: number;
  amenities: Amenity[];
}

export interface HotelDetail {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  rating: number;
  imageUrl: string;
  contactPhone: string;
  contactEmail: string;
  amenities: Amenity[];
  rooms: Room[];
}

export interface HotelComparison {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  rating: number;
  imageUrl: string;
  startingPrice: number;
  amenities: Amenity[];
  roomTypes: string[];
}

export interface CreateBookingRequest {
  roomId: number;
  customerName: string;
  customerEmail: string;
  checkInDate: string;  // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
}

export interface BookingResponse {
  bookingReference: string;
  hotelId: number;
  hotelName: string;
  hotelCity: string;
  hotelAddress: string;
  roomId: number;
  roomType: string;
  customerName: string;
  customerEmail: string;
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  pricePerNight: number;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

export interface CancelBookingRequest {
  customerEmail: string;
}
