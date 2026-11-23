package com.thomascook.hotelbooking.service;

import com.thomascook.hotelbooking.dto.BookingResponseDTO;
import com.thomascook.hotelbooking.dto.CreateBookingRequest;
import com.thomascook.hotelbooking.entity.Booking;
import com.thomascook.hotelbooking.entity.BookingStatus;
import com.thomascook.hotelbooking.entity.Hotel;
import com.thomascook.hotelbooking.entity.Room;
import com.thomascook.hotelbooking.exception.InvalidBookingException;
import com.thomascook.hotelbooking.exception.ResourceNotFoundException;
import com.thomascook.hotelbooking.exception.RoomUnavailableException;
import com.thomascook.hotelbooking.repository.BookingRepository;
import com.thomascook.hotelbooking.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private BookingService bookingService;

    private Hotel sampleHotel;
    private Room sampleRoom;

    @BeforeEach
    void setUp() {
        sampleHotel = new Hotel();
        sampleHotel.setId(1L);
        sampleHotel.setName("The Grand London Heritage");
        sampleHotel.setCity("London");
        sampleHotel.setAddress("10 Westminster Bridge Rd");

        sampleRoom = new Room();
        sampleRoom.setId(101L);
        sampleRoom.setHotel(sampleHotel);
        sampleRoom.setRoomType("Deluxe King Suite");
        sampleRoom.setPricePerNight(new BigDecimal("200.00"));
        sampleRoom.setTotalInventory(5);
        sampleRoom.setMaxOccupancy(2);
    }

    @Test
    @DisplayName("Should successfully create booking and calculate server-side total amount")
    void shouldSuccessfullyCreateBooking() {
        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(5); // 3 nights

        CreateBookingRequest request = new CreateBookingRequest(
                101L, "Alice Walker", "alice@example.com", checkIn, checkOut
        );

        when(roomRepository.findByIdWithPessimisticLock(101L)).thenReturn(Optional.of(sampleRoom));
        when(bookingRepository.countOverlappingBookings(eq(101L), eq(BookingStatus.CONFIRMED), eq(checkIn), eq(checkOut)))
                .thenReturn(2L); // 2 out of 5 booked -> 3 available

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(50L);
            return b;
        });

        BookingResponseDTO response = bookingService.createBooking(request);

        assertNotNull(response);
        assertNotNull(response.getBookingReference());
        assertTrue(response.getBookingReference().startsWith("TC-BK-"));
        assertEquals("Alice Walker", response.getCustomerName());
        assertEquals("alice@example.com", response.getCustomerEmail());
        assertEquals(3, response.getTotalNights());
        assertEquals(new BigDecimal("600.00"), response.getTotalPrice()); // 3 nights * 200.00
        assertEquals("CONFIRMED", response.getStatus());

        verify(roomRepository, times(1)).findByIdWithPessimisticLock(101L);
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should reject booking when check-out date is equal to or before check-in date")
    void shouldRejectBookingWhenCheckOutIsBeforeCheckIn() {
        LocalDate checkIn = LocalDate.now().plusDays(5);
        LocalDate checkOut = LocalDate.now().plusDays(3);

        CreateBookingRequest request = new CreateBookingRequest(
                101L, "Bob Smith", "bob@example.com", checkIn, checkOut
        );

        InvalidBookingException exception = assertThrows(InvalidBookingException.class, () ->
                bookingService.createBooking(request)
        );

        assertTrue(exception.getMessage().contains("must be at least one day after"));
        verifyNoInteractions(roomRepository);
    }

    @Test
    @DisplayName("Should reject booking when check-in date is in the past")
    void shouldRejectBookingWhenCheckInIsInPast() {
        LocalDate checkIn = LocalDate.now().minusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(2);

        CreateBookingRequest request = new CreateBookingRequest(
                101L, "Bob Smith", "bob@example.com", checkIn, checkOut
        );

        InvalidBookingException exception = assertThrows(InvalidBookingException.class, () ->
                bookingService.createBooking(request)
        );

        assertTrue(exception.getMessage().contains("cannot be in the past"));
    }

    @Test
    @DisplayName("Should prevent overbooking when all rooms are already reserved for selected dates")
    void shouldThrowRoomUnavailableExceptionWhenInventoryIsExhausted() {
        LocalDate checkIn = LocalDate.now().plusDays(10);
        LocalDate checkOut = LocalDate.now().plusDays(12);

        CreateBookingRequest request = new CreateBookingRequest(
                101L, "Charlie Brown", "charlie@example.com", checkIn, checkOut
        );

        when(roomRepository.findByIdWithPessimisticLock(101L)).thenReturn(Optional.of(sampleRoom));
        when(bookingRepository.countOverlappingBookings(eq(101L), eq(BookingStatus.CONFIRMED), eq(checkIn), eq(checkOut)))
                .thenReturn(5L); // 5 out of 5 booked -> 0 available

        RoomUnavailableException exception = assertThrows(RoomUnavailableException.class, () ->
                bookingService.createBooking(request)
        );

        assertTrue(exception.getMessage().contains("All 5 room(s) are currently booked"));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should retrieve booking by reference and case-insensitive email")
    void shouldRetrieveBookingSuccessfully() {
        Booking existingBooking = new Booking();
        existingBooking.setId(10L);
        existingBooking.setBookingReference("TC-BK-998877");
        existingBooking.setRoom(sampleRoom);
        existingBooking.setCustomerName("David Miller");
        existingBooking.setCustomerEmail("david.miller@example.com");
        existingBooking.setCheckInDate(LocalDate.now().plusDays(1));
        existingBooking.setCheckOutDate(LocalDate.now().plusDays(3));
        existingBooking.setTotalNights(2);
        existingBooking.setTotalPrice(new BigDecimal("400.00"));
        existingBooking.setStatus(BookingStatus.CONFIRMED);

        when(bookingRepository.findByBookingReferenceAndCustomerEmailIgnoreCase("TC-BK-998877", "DAVID.MILLER@EXAMPLE.COM"))
                .thenReturn(Optional.of(existingBooking));

        BookingResponseDTO result = bookingService.getBookingByReferenceAndEmail("TC-BK-998877", "DAVID.MILLER@EXAMPLE.COM");

        assertNotNull(result);
        assertEquals("TC-BK-998877", result.getBookingReference());
        assertEquals("David Miller", result.getCustomerName());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when booking does not exist")
    void shouldThrowWhenBookingNotFound() {
        when(bookingRepository.findByBookingReferenceAndCustomerEmailIgnoreCase(any(), any()))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                bookingService.getBookingByReferenceAndEmail("TC-BK-000000", "test@test.com")
        );
    }

    @Test
    @DisplayName("Should cancel booking and update status to CANCELLED")
    void shouldCancelBookingSuccessfully() {
        Booking booking = new Booking();
        booking.setId(20L);
        booking.setBookingReference("TC-BK-123456");
        booking.setRoom(sampleRoom);
        booking.setCustomerName("Eva Green");
        booking.setCustomerEmail("eva@example.com");
        booking.setCheckInDate(LocalDate.now().plusDays(10));
        booking.setCheckOutDate(LocalDate.now().plusDays(12));
        booking.setTotalNights(2);
        booking.setTotalPrice(new BigDecimal("400.00"));
        booking.setStatus(BookingStatus.CONFIRMED);

        when(bookingRepository.findByBookingReferenceAndCustomerEmailIgnoreCase("TC-BK-123456", "eva@example.com"))
                .thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));

        BookingResponseDTO cancelled = bookingService.cancelBooking("TC-BK-123456", "eva@example.com");

        assertNotNull(cancelled);
        assertEquals("CANCELLED", cancelled.getStatus());
        verify(bookingRepository, times(1)).save(booking);
    }

    @Test
    @DisplayName("Should reject cancellation when booking is already CANCELLED")
    void shouldRejectCancellationWhenAlreadyCancelled() {
        Booking booking = new Booking();
        booking.setBookingReference("TC-BK-123456");
        booking.setRoom(sampleRoom);
        booking.setCustomerEmail("eva@example.com");
        booking.setStatus(BookingStatus.CANCELLED);

        when(bookingRepository.findByBookingReferenceAndCustomerEmailIgnoreCase("TC-BK-123456", "eva@example.com"))
                .thenReturn(Optional.of(booking));

        InvalidBookingException ex = assertThrows(InvalidBookingException.class, () ->
                bookingService.cancelBooking("TC-BK-123456", "eva@example.com")
        );

        assertTrue(ex.getMessage().contains("already cancelled"));
        verify(bookingRepository, never()).save(any());
    }
}
