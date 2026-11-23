package com.thomascook.hotelbooking.controller;

import com.thomascook.hotelbooking.dto.BookingResponseDTO;
import com.thomascook.hotelbooking.dto.CancelBookingRequest;
import com.thomascook.hotelbooking.dto.CreateBookingRequest;
import com.thomascook.hotelbooking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Create a new hotel booking with server-side pricing and concurrency safety.
     */
    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        BookingResponseDTO booking = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    /**
     * Retrieve an existing booking by its unique reference code and customer email.
     */
    @GetMapping("/lookup")
    public ResponseEntity<BookingResponseDTO> getBooking(
            @RequestParam String reference,
            @RequestParam String email) {

        BookingResponseDTO booking = bookingService.getBookingByReferenceAndEmail(reference, email);
        return ResponseEntity.ok(booking);
    }

    /**
     * Cancel an existing booking and automatically restore room inventory.
     */
    @PostMapping("/{reference}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable String reference,
            @Valid @RequestBody CancelBookingRequest request) {

        BookingResponseDTO cancelledBooking = bookingService.cancelBooking(reference, request.getCustomerEmail());
        return ResponseEntity.ok(cancelledBooking);
    }
}
