package com.thomascook.hotelbooking.service;

import com.thomascook.hotelbooking.dto.*;
import com.thomascook.hotelbooking.entity.Amenity;
import com.thomascook.hotelbooking.entity.BookingStatus;
import com.thomascook.hotelbooking.entity.Hotel;
import com.thomascook.hotelbooking.entity.Room;
import com.thomascook.hotelbooking.exception.ResourceNotFoundException;
import com.thomascook.hotelbooking.repository.BookingRepository;
import com.thomascook.hotelbooking.repository.HotelRepository;
import com.thomascook.hotelbooking.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public HotelService(HotelRepository hotelRepository, RoomRepository roomRepository, BookingRepository bookingRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<HotelSummaryDTO> searchHotels(String city, LocalDate checkIn, LocalDate checkOut) {
        return searchHotels(city, checkIn, checkOut, null, null, null, null, null);
    }

    public List<HotelSummaryDTO> searchHotels(
            String city,
            LocalDate checkIn,
            LocalDate checkOut,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minRating,
            String amenity,
            String sortBy) {

        List<Hotel> hotels;
        if (city != null && !city.trim().isEmpty()) {
            hotels = hotelRepository.searchByCityWithAmenities(city.trim());
        } else {
            hotels = hotelRepository.findAllWithAmenities();
        }

        List<HotelSummaryDTO> list = hotels.stream()
                .map(this::mapToSummaryDTO)
                .filter(h -> {
                    if (minPrice != null && h.getStartingPrice().compareTo(minPrice) < 0) return false;
                    if (maxPrice != null && h.getStartingPrice().compareTo(maxPrice) > 0) return false;
                    if (minRating != null && h.getRating().compareTo(minRating) < 0) return false;
                    if (amenity != null && !amenity.trim().isEmpty()) {
                        String target = amenity.trim().toLowerCase();
                        boolean hasAmenity = h.getAmenities().stream()
                                .anyMatch(a -> a.getName().toLowerCase().contains(target));
                        if (!hasAmenity) return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());

        if ("price_asc".equalsIgnoreCase(sortBy)) {
            list.sort(Comparator.comparing(HotelSummaryDTO::getStartingPrice));
        } else if ("price_desc".equalsIgnoreCase(sortBy)) {
            list.sort(Comparator.comparing(HotelSummaryDTO::getStartingPrice).reversed());
        } else if ("rating_desc".equalsIgnoreCase(sortBy)) {
            list.sort(Comparator.comparing(HotelSummaryDTO::getRating).reversed());
        } else if ("name_asc".equalsIgnoreCase(sortBy)) {
            list.sort(Comparator.comparing(HotelSummaryDTO::getName, String.CASE_INSENSITIVE_ORDER));
        }

        return list;
    }

    public HotelDetailDTO getHotelDetails(Long id, LocalDate checkIn, LocalDate checkOut) {
        Hotel hotel = hotelRepository.findByIdWithRoomsAndAmenities(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        HotelDetailDTO dto = new HotelDetailDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setCity(hotel.getCity());
        dto.setAddress(hotel.getAddress());
        dto.setDescription(hotel.getDescription());
        dto.setRating(hotel.getRating());
        dto.setImageUrl(hotel.getImageUrl());
        dto.setContactPhone(hotel.getContactPhone());
        dto.setContactEmail(hotel.getContactEmail());

        dto.setAmenities(hotel.getAmenities().stream()
                .map(a -> new AmenityDTO(a.getId(), a.getName(), a.getIconCode()))
                .sorted(Comparator.comparing(AmenityDTO::getName))
                .collect(Collectors.toList()));

        List<RoomDTO> roomDTOs = hotel.getRooms().stream()
                .map(room -> mapToRoomDTO(room, checkIn, checkOut))
                .sorted(Comparator.comparing(RoomDTO::getPricePerNight))
                .collect(Collectors.toList());
        dto.setRooms(roomDTOs);

        return dto;
    }

    public List<HotelComparisonDTO> compareHotels(List<Long> hotelIds) {
        if (hotelIds == null || hotelIds.isEmpty()) {
            return Collections.emptyList();
        }

        // Limit comparison to at most 3 hotels
        List<Long> limitedIds = hotelIds.stream().distinct().limit(3).collect(Collectors.toList());
        List<Hotel> hotels = hotelRepository.findByIdInWithAmenities(limitedIds);

        return hotels.stream().map(hotel -> {
            HotelComparisonDTO dto = new HotelComparisonDTO();
            dto.setId(hotel.getId());
            dto.setName(hotel.getName());
            dto.setCity(hotel.getCity());
            dto.setAddress(hotel.getAddress());
            dto.setDescription(hotel.getDescription());
            dto.setRating(hotel.getRating());
            dto.setImageUrl(hotel.getImageUrl());

            List<Room> rooms = roomRepository.findByHotelId(hotel.getId());
            BigDecimal startingPrice = rooms.stream()
                    .map(Room::getPricePerNight)
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);
            dto.setStartingPrice(startingPrice);

            dto.setAmenities(hotel.getAmenities().stream()
                    .map(a -> new AmenityDTO(a.getId(), a.getName(), a.getIconCode()))
                    .sorted(Comparator.comparing(AmenityDTO::getName))
                    .collect(Collectors.toList()));

            dto.setRoomTypes(rooms.stream()
                    .map(Room::getRoomType)
                    .collect(Collectors.toList()));

            return dto;
        }).collect(Collectors.toList());
    }

    private HotelSummaryDTO mapToSummaryDTO(Hotel hotel) {
        HotelSummaryDTO dto = new HotelSummaryDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setCity(hotel.getCity());
        dto.setAddress(hotel.getAddress());
        dto.setDescription(hotel.getDescription());
        dto.setRating(hotel.getRating());
        dto.setImageUrl(hotel.getImageUrl());

        List<Room> rooms = roomRepository.findByHotelId(hotel.getId());
        BigDecimal startingPrice = rooms.stream()
                .map(Room::getPricePerNight)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
        dto.setStartingPrice(startingPrice);

        dto.setAmenities(hotel.getAmenities().stream()
                .map(a -> new AmenityDTO(a.getId(), a.getName(), a.getIconCode()))
                .sorted(Comparator.comparing(AmenityDTO::getName))
                .collect(Collectors.toList()));

        return dto;
    }

    private RoomDTO mapToRoomDTO(Room room, LocalDate checkIn, LocalDate checkOut) {
        RoomDTO dto = new RoomDTO();
        dto.setId(room.getId());
        dto.setRoomType(room.getRoomType());
        dto.setPricePerNight(room.getPricePerNight());
        dto.setTotalInventory(room.getTotalInventory());
        dto.setMaxOccupancy(room.getMaxOccupancy());
        dto.setDescription(room.getDescription());

        if (checkIn != null && checkOut != null && checkOut.isAfter(checkIn)) {
            long booked = bookingRepository.countOverlappingBookings(
                    room.getId(),
                    BookingStatus.CONFIRMED,
                    checkIn,
                    checkOut
            );
            int available = Math.max(0, room.getTotalInventory() - (int) booked);
            dto.setAvailableRooms(available);
        } else {
            dto.setAvailableRooms(room.getTotalInventory());
        }

        return dto;
    }
}
