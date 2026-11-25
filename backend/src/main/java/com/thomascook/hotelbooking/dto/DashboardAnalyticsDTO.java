package com.thomascook.hotelbooking.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardAnalyticsDTO {
    private long totalHotels;
    private long totalRooms;
    private long totalBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private BigDecimal totalRevenue;
    private double occupancyRate;
    private List<CityAnalyticsDTO> cityAnalytics;
    private List<BookingResponseDTO> recentBookings;

    public DashboardAnalyticsDTO() {
    }

    public long getTotalHotels() {
        return totalHotels;
    }

    public void setTotalHotels(long totalHotels) {
        this.totalHotels = totalHotels;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }

    public long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(double occupancyRate) {
        this.occupancyRate = occupancyRate;
    }

    public List<CityAnalyticsDTO> getCityAnalytics() {
        return cityAnalytics;
    }

    public void setCityAnalytics(List<CityAnalyticsDTO> cityAnalytics) {
        this.cityAnalytics = cityAnalytics;
    }

    public List<BookingResponseDTO> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<BookingResponseDTO> recentBookings) {
        this.recentBookings = recentBookings;
    }
}
