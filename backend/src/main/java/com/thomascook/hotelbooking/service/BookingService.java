package com.thomascook.hotelbooking.service;

import com.thomascook.hotelbooking.dto.BookingResponseDTO;
import com.thomascook.hotelbooking.dto.CreateBookingRequest;
import com.thomascook.hotelbooking.entity.Booking;
import com.thomascook.hotelbooking.entity.BookingStatus;
import com.thomascook.hotelbooking.entity.Room;
import com.thomascook.hotelbooking.exception.InvalidBookingException;
import com.thomascook.hotelbooking.exception.ResourceNotFoundException;
import com.thomascook.hotelbooking.exception.RoomUnavailableException;
import com.thomascook.hotelbooking.repository.BookingRepository;
import com.thomascook.hotelbooking.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    /**
     * Creates a new booking within a transactional boundary with pessimistic write lock
     * on the Room record to guarantee thread-safe inventory decrement and eliminate race condition overbooking.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public BookingResponseDTO createBooking(CreateBookingRequest request) {
        validateBookingDates(request.getCheckInDate(), request.getCheckOutDate());

        // Lock the Room record for this transaction
        Room room = roomRepository.findByIdWithPessimisticLock(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        // Count existing confirmed bookings that overlap with requested dates
        long overlappingCount = bookingRepository.countOverlappingBookings(
                room.getId(),
                BookingStatus.CONFIRMED,
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        int available = room.getTotalInventory() - (int) overlappingCount;
        if (available <= 0) {
            throw new RoomUnavailableException(
                String.format("No rooms of type '%s' at '%s' are available from %s to %s. All %d room(s) are currently booked.",
                        room.getRoomType(), room.getHotel().getName(),
                        request.getCheckInDate(), request.getCheckOutDate(),
                        room.getTotalInventory())
            );
        }

        // Calculate nights and backend total amount
        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        // Generate unique booking reference: TC-BK-XXXXXX
        String reference = generateUniqueBookingReference();

        Booking booking = new Booking();
        booking.setBookingReference(reference);
        booking.setRoom(room);
        booking.setCustomerName(request.getCustomerName().trim());
        booking.setCustomerEmail(request.getCustomerEmail().trim().toLowerCase());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setTotalNights((int) nights);
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.CONFIRMED);

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponseDTO(savedBooking);
    }

    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingByReferenceAndEmail(String reference, String email) {
        if (reference == null || reference.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            throw new InvalidBookingException("Both booking reference and customer email are required.");
        }

        Booking booking = bookingRepository.findByBookingReferenceAndCustomerEmailIgnoreCase(reference.trim(), email.trim())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No booking found matching reference '" + reference.trim() + "' and email '" + email.trim() + "'."
                ));

        return mapToResponseDTO(booking);
    }

    /**
     * Cancels an existing booking and instantly restores room availability
     * since availability queries filter on status = 'CONFIRMED'.
     */
    @Transactional
    public BookingResponseDTO cancelBooking(String reference, String email) {
        if (reference == null || reference.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            throw new InvalidBookingException("Both booking reference and customer email are required.");
        }

        Booking booking = bookingRepository.findByBookingReferenceAndCustomerEmailIgnoreCase(reference.trim(), email.trim())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No booking found matching reference '" + reference.trim() + "' and email '" + email.trim() + "'."
                ));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new InvalidBookingException("Booking '" + reference + "' is already cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        return mapToResponseDTO(updatedBooking);
    }

    private void validateBookingDates(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new InvalidBookingException("Check-in and check-out dates are required.");
        }

        LocalDate today = LocalDate.now();
        if (checkIn.isBefore(today)) {
            throw new InvalidBookingException("Check-in date cannot be in the past (" + checkIn + ").");
        }

        if (!checkOut.isAfter(checkIn)) {
            throw new InvalidBookingException("Check-out date (" + checkOut + ") must be at least one day after check-in date (" + checkIn + ").");
        }
    }

    private String generateUniqueBookingReference() {
        String reference;
        do {
            int randomNum = 100000 + secureRandom.nextInt(900000);
            reference = "TC-BK-" + randomNum;
        } while (bookingRepository.findByBookingReference(reference).isPresent());
        return reference;
    }

    private BookingResponseDTO mapToResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingReference(booking.getBookingReference());
        dto.setHotelId(booking.getRoom().getHotel().getId());
        dto.setHotelName(booking.getRoom().getHotel().getName());
        dto.setHotelCity(booking.getRoom().getHotel().getCity());
        dto.setHotelAddress(booking.getRoom().getHotel().getAddress());
        dto.setRoomId(booking.getRoom().getId());
        dto.setRoomType(booking.getRoom().getRoomType());
        dto.setCustomerName(booking.getCustomerName());
        dto.setCustomerEmail(booking.getCustomerEmail());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setTotalNights(booking.getTotalNights());
        dto.setPricePerNight(booking.getRoom().getPricePerNight());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus().name());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
