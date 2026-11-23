package com.thomascook.hotelbooking.controller;

import com.thomascook.hotelbooking.dto.HotelComparisonDTO;
import com.thomascook.hotelbooking.dto.HotelDetailDTO;
import com.thomascook.hotelbooking.dto.HotelSummaryDTO;
import com.thomascook.hotelbooking.service.HotelService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    /**
     * Search hotels by city and optional check-in / check-out dates.
     */
    @GetMapping
    public ResponseEntity<List<HotelSummaryDTO>> searchHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {

        List<HotelSummaryDTO> hotels = hotelService.searchHotels(city, checkIn, checkOut);
        return ResponseEntity.ok(hotels);
    }

    /**
     * Get hotel details and room list with live availability for given date range.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HotelDetailDTO> getHotelDetails(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {

        HotelDetailDTO hotel = hotelService.getHotelDetails(id, checkIn, checkOut);
        return ResponseEntity.ok(hotel);
    }

    /**
     * Surprise Feature: Compare up to three hotels side-by-side.
     */
    @GetMapping("/compare")
    public ResponseEntity<List<HotelComparisonDTO>> compareHotels(
            @RequestParam List<Long> hotelIds) {

        List<HotelComparisonDTO> comparison = hotelService.compareHotels(hotelIds);
        return ResponseEntity.ok(comparison);
    }
}
