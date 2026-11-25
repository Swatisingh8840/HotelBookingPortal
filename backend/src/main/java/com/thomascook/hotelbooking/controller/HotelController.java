package com.thomascook.hotelbooking.controller;

import com.thomascook.hotelbooking.dto.HotelComparisonDTO;
import com.thomascook.hotelbooking.dto.HotelDetailDTO;
import com.thomascook.hotelbooking.dto.HotelSummaryDTO;
import com.thomascook.hotelbooking.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/hotels")
@Tag(name = "Hotel Discovery & Comparison", description = "Endpoints for searching hotels, retrieving room availability, and comparing accommodations.")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    /**
     * Search hotels by city, dates, price range, minimum rating, amenity, and sorting order.
     */
    @GetMapping
    @Operation(summary = "Search & Filter Hotels", description = "Find hotels matching location, dates, price limits, star ratings, and amenities with optional sorting.")
    public ResponseEntity<List<HotelSummaryDTO>> searchHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(required = false) String amenity,
            @RequestParam(required = false) String sortBy) {

        List<HotelSummaryDTO> hotels = hotelService.searchHotels(city, checkIn, checkOut, minPrice, maxPrice, minRating, amenity, sortBy);
        return ResponseEntity.ok(hotels);
    }

    /**
     * Get hotel details and room list with live availability for given date range.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get Hotel Details & Live Room Availability", description = "Retrieve full profile, amenity catalog, and real-time room inventory for requested dates.")
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
    @Operation(summary = "Compare Up to 3 Hotels (Surprise Feature)", description = "Side-by-side comparative attributes, pricing, ratings, and amenity matrices.")
    public ResponseEntity<List<HotelComparisonDTO>> compareHotels(
            @RequestParam List<Long> hotelIds) {

        List<HotelComparisonDTO> comparison = hotelService.compareHotels(hotelIds);
        return ResponseEntity.ok(comparison);
    }
}
