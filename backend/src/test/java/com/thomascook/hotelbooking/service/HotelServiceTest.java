package com.thomascook.hotelbooking.service;

import com.thomascook.hotelbooking.dto.HotelComparisonDTO;
import com.thomascook.hotelbooking.dto.HotelDetailDTO;
import com.thomascook.hotelbooking.dto.HotelSummaryDTO;
import com.thomascook.hotelbooking.entity.Amenity;
import com.thomascook.hotelbooking.entity.BookingStatus;
import com.thomascook.hotelbooking.entity.Hotel;
import com.thomascook.hotelbooking.entity.Room;
import com.thomascook.hotelbooking.exception.ResourceNotFoundException;
import com.thomascook.hotelbooking.repository.BookingRepository;
import com.thomascook.hotelbooking.repository.HotelRepository;
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
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HotelServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private HotelService hotelService;

    private Hotel hotel1;
    private Hotel hotel2;
    private Hotel hotel3;
    private Hotel hotel4;

    @BeforeEach
    void setUp() {
        Amenity wifi = new Amenity(1L, "Free WiFi", "wifi");
        Amenity pool = new Amenity(2L, "Pool", "pool");

        hotel1 = new Hotel();
        hotel1.setId(1L);
        hotel1.setName("Hotel One");
        hotel1.setCity("London");
        hotel1.setDescription("Desc 1");
        hotel1.setRating(new BigDecimal("4.8"));
        hotel1.setImageUrl("http://img1.jpg");
        hotel1.setAmenities(Set.of(wifi, pool));

        hotel2 = new Hotel();
        hotel2.setId(2L);
        hotel2.setName("Hotel Two");
        hotel2.setCity("Paris");
        hotel2.setDescription("Desc 2");
        hotel2.setRating(new BigDecimal("4.5"));
        hotel2.setImageUrl("http://img2.jpg");
        hotel2.setAmenities(Set.of(wifi));

        hotel3 = new Hotel();
        hotel3.setId(3L);
        hotel3.setName("Hotel Three");
        hotel3.setCity("Dubai");
        hotel3.setDescription("Desc 3");
        hotel3.setRating(new BigDecimal("4.9"));
        hotel3.setImageUrl("http://img3.jpg");
        hotel3.setAmenities(Set.of(pool));

        hotel4 = new Hotel();
        hotel4.setId(4L);
        hotel4.setName("Hotel Four");
        hotel4.setCity("Tokyo");
        hotel4.setDescription("Desc 4");
        hotel4.setRating(new BigDecimal("4.6"));
        hotel4.setImageUrl("http://img4.jpg");
    }

    @Test
    @DisplayName("Should search hotels by city name")
    void shouldSearchHotelsByCity() {
        when(hotelRepository.searchByCityWithAmenities("London")).thenReturn(List.of(hotel1));
        when(roomRepository.findByHotelId(1L)).thenReturn(List.of(createRoom(101L, "Deluxe", new BigDecimal("150.00"), 5)));

        List<HotelSummaryDTO> result = hotelService.searchHotels("London", null, null);

        assertEquals(1, result.size());
        assertEquals("Hotel One", result.get(0).getName());
        assertEquals("London", result.get(0).getCity());
        assertEquals(new BigDecimal("150.00"), result.get(0).getStartingPrice());
    }

    @Test
    @DisplayName("Should return all hotels when city search parameter is null or empty")
    void shouldReturnAllHotelsWhenCityIsEmpty() {
        when(hotelRepository.findAllWithAmenities()).thenReturn(List.of(hotel1, hotel2));
        when(roomRepository.findByHotelId(anyLong())).thenReturn(Collections.emptyList());

        List<HotelSummaryDTO> result = hotelService.searchHotels(null, null, null);

        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("Should calculate available rooms dynamically for given date range")
    void shouldCalculateAvailableRoomsForDateRange() {
        Room r1 = createRoom(101L, "Deluxe", new BigDecimal("200.00"), 5);
        hotel1.setRooms(List.of(r1));

        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(5);

        when(hotelRepository.findByIdWithRoomsAndAmenities(1L)).thenReturn(Optional.of(hotel1));
        when(bookingRepository.countOverlappingBookings(101L, BookingStatus.CONFIRMED, checkIn, checkOut))
                .thenReturn(3L); // 3 of 5 booked -> 2 available

        HotelDetailDTO details = hotelService.getHotelDetails(1L, checkIn, checkOut);

        assertNotNull(details);
        assertEquals(1, details.getRooms().size());
        assertEquals(2, details.getRooms().get(0).getAvailableRooms());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when hotel ID does not exist")
    void shouldThrowWhenHotelNotFound() {
        when(hotelRepository.findByIdWithRoomsAndAmenities(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                hotelService.getHotelDetails(999L, null, null)
        );
    }

    @Test
    @DisplayName("Surprise Feature: Should limit comparison to at most 3 hotels")
    void shouldLimitComparisonToMaxThreeHotels() {
        when(hotelRepository.findByIdInWithAmenities(List.of(1L, 2L, 3L)))
                .thenReturn(List.of(hotel1, hotel2, hotel3));
        when(roomRepository.findByHotelId(anyLong())).thenReturn(Collections.emptyList());

        List<HotelComparisonDTO> comparison = hotelService.compareHotels(List.of(1L, 2L, 3L, 4L));

        // Limited to 3
        assertEquals(3, comparison.size());
    }

    private Room createRoom(Long id, String type, BigDecimal price, int inventory) {
        Room r = new Room();
        r.setId(id);
        r.setRoomType(type);
        r.setPricePerNight(price);
        r.setTotalInventory(inventory);
        r.setMaxOccupancy(2);
        r.setDescription("Test room");
        return r;
    }
}
