package com.thomascook.hotelbooking.dto;

public class CityAnalyticsDTO {
    private String city;
    private long hotelCount;
    private long bookingCount;

    public CityAnalyticsDTO() {
    }

    public CityAnalyticsDTO(String city, long hotelCount, long bookingCount) {
        this.city = city;
        this.hotelCount = hotelCount;
        this.bookingCount = bookingCount;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public long getHotelCount() {
        return hotelCount;
    }

    public void setHotelCount(long hotelCount) {
        this.hotelCount = hotelCount;
    }

    public long getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(long bookingCount) {
        this.bookingCount = bookingCount;
    }
}
