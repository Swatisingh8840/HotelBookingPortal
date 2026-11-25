package com.thomascook.hotelbooking.repository;

import com.thomascook.hotelbooking.entity.Booking;
import com.thomascook.hotelbooking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Counts active CONFIRMED reservations that overlap with the requested date range.
     * Overlap condition:
     * existing.checkIn < requested.checkOut AND existing.checkOut > requested.checkIn
     */
    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE b.room.id = :roomId " +
           "AND b.status = :status " +
           "AND b.checkInDate < :requestedCheckOut " +
           "AND b.checkOutDate > :requestedCheckIn")
    long countOverlappingBookings(
        @Param("roomId") Long roomId,
        @Param("status") BookingStatus status,
        @Param("requestedCheckIn") LocalDate requestedCheckIn,
        @Param("requestedCheckOut") LocalDate requestedCheckOut
    );

    Optional<Booking> findByBookingReferenceAndCustomerEmailIgnoreCase(String bookingReference, String customerEmail);

    Optional<Booking> findByBookingReference(String bookingReference);

    long countByStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.status = :status")
    java.math.BigDecimal sumTotalPriceByStatus(@Param("status") BookingStatus status);

    java.util.List<Booking> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT b.room.hotel.city, COUNT(b) FROM Booking b WHERE b.status = 'CONFIRMED' GROUP BY b.room.hotel.city")
    java.util.List<Object[]> countBookingsByCity();
}
