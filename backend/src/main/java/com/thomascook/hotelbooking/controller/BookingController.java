package com.thomascook.hotelbooking.controller;

import com.thomascook.hotelbooking.dto.BookingResponseDTO;
import com.thomascook.hotelbooking.dto.CancelBookingRequest;
import com.thomascook.hotelbooking.dto.CreateBookingRequest;
import com.thomascook.hotelbooking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
@Tag(name = "Booking Engine & Inventory", description = "Endpoints for creating reservations, date validation, lookup vouchers, and cancellation with inventory restoration.")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Create a new hotel booking with server-side pricing and concurrency safety.
     */
    @PostMapping
    @Operation(summary = "Create Hotel Reservation", description = "Safely reserves a room using row-level pessimistic locking, validates dates, calculates server-side pricing, and generates unique reference code.")
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        BookingResponseDTO booking = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    /**
     * Retrieve an existing booking by its unique reference code and customer email.
     */
    @GetMapping("/lookup")
    @Operation(summary = "Lookup Reservation Voucher", description = "Retrieve confirmed or cancelled booking voucher by booking reference and customer email.")
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
    @Operation(summary = "Cancel Reservation", description = "Cancels a confirmed reservation, validates email ownership, and immediately releases room inventory.")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable String reference,
            @Valid @RequestBody CancelBookingRequest request) {

        BookingResponseDTO cancelledBooking = bookingService.cancelBooking(reference, request.getCustomerEmail());
        return ResponseEntity.ok(cancelledBooking);
    }
}
