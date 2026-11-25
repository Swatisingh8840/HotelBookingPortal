package com.thomascook.hotelbooking.service;

import com.thomascook.hotelbooking.dto.BookingResponseDTO;
import com.thomascook.hotelbooking.dto.CityAnalyticsDTO;
import com.thomascook.hotelbooking.dto.DashboardAnalyticsDTO;
import com.thomascook.hotelbooking.entity.Booking;
import com.thomascook.hotelbooking.entity.BookingStatus;
import com.thomascook.hotelbooking.repository.BookingRepository;
import com.thomascook.hotelbooking.repository.HotelRepository;
import com.thomascook.hotelbooking.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public AnalyticsService(HotelRepository hotelRepository, RoomRepository roomRepository, BookingRepository bookingRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public DashboardAnalyticsDTO getDashboardStats() {
        DashboardAnalyticsDTO dto = new DashboardAnalyticsDTO();

        long totalHotels = hotelRepository.count();
        long totalRoomsInventory = roomRepository.sumTotalRoomInventory();
        long confirmedBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED);
        long cancelledBookings = bookingRepository.countByStatus(BookingStatus.CANCELLED);
        long totalBookings = confirmedBookings + cancelledBookings;

        BigDecimal totalRevenue = bookingRepository.sumTotalPriceByStatus(BookingStatus.CONFIRMED);
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        double occupancyRate = 0.0;
        if (totalRoomsInventory > 0) {
            occupancyRate = Math.min(100.0, (double) confirmedBookings / (double) totalRoomsInventory * 100.0);
            occupancyRate = BigDecimal.valueOf(occupancyRate).setScale(1, RoundingMode.HALF_UP).doubleValue();
        }

        // City Breakdown
        Map<String, Long> hotelCountByCity = new HashMap<>();
        List<Object[]> hotelCityRows = hotelRepository.countHotelsByCity();
        for (Object[] row : hotelCityRows) {
            if (row != null && row.length >= 2 && row[0] != null) {
                hotelCountByCity.put(row[0].toString(), ((Number) row[1]).longValue());
            }
        }

        Map<String, Long> bookingCountByCity = new HashMap<>();
        List<Object[]> bookingCityRows = bookingRepository.countBookingsByCity();
        for (Object[] row : bookingCityRows) {
            if (row != null && row.length >= 2 && row[0] != null) {
                bookingCountByCity.put(row[0].toString(), ((Number) row[1]).longValue());
            }
        }

        Set<String> allCities = new TreeSet<>(hotelCountByCity.keySet());
        allCities.addAll(bookingCountByCity.keySet());

        List<CityAnalyticsDTO> cityList = new ArrayList<>();
        for (String city : allCities) {
            cityList.add(new CityAnalyticsDTO(
                    city,
                    hotelCountByCity.getOrDefault(city, 0L),
                    bookingCountByCity.getOrDefault(city, 0L)
            ));
        }

        // Recent bookings
        List<BookingResponseDTO> recent = bookingRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::mapBookingToResponse)
                .collect(Collectors.toList());

        dto.setTotalHotels(totalHotels);
        dto.setTotalRooms(totalRoomsInventory);
        dto.setTotalBookings(totalBookings);
        dto.setConfirmedBookings(confirmedBookings);
        dto.setCancelledBookings(cancelledBookings);
        dto.setTotalRevenue(totalRevenue.setScale(2, RoundingMode.HALF_UP));
        dto.setOccupancyRate(occupancyRate);
        dto.setCityAnalytics(cityList);
        dto.setRecentBookings(recent);

        return dto;
    }

    private BookingResponseDTO mapBookingToResponse(Booking booking) {
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
        dto.setBasePrice(booking.getBasePrice());
        dto.setDiscountAmount(booking.getDiscountAmount());
        dto.setTaxAmount(booking.getTaxAmount());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setPromoCode(booking.getPromoCode());
        dto.setStatus(booking.getStatus().name());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
