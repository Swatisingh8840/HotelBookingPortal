package com.thomascook.hotelbooking.dto;

import java.util.List;

public class ConcurrencySimulationResultDTO {
    private Long roomId;
    private String roomType;
    private String hotelName;
    private int totalInventory;
    private int initialAvailableRooms;
    private int totalConcurrentAttempts;
    private int successfulBookings;
    private int preventedOverbookings;
    private long totalDurationMs;
    private String isolationGuarantee;
    private List<ThreadAttemptLog> logs;

    public ConcurrencySimulationResultDTO() {
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public int getTotalInventory() {
        return totalInventory;
    }

    public void setTotalInventory(int totalInventory) {
        this.totalInventory = totalInventory;
    }

    public int getInitialAvailableRooms() {
        return initialAvailableRooms;
    }

    public void setInitialAvailableRooms(int initialAvailableRooms) {
        this.initialAvailableRooms = initialAvailableRooms;
    }

    public int getTotalConcurrentAttempts() {
        return totalConcurrentAttempts;
    }

    public void setTotalConcurrentAttempts(int totalConcurrentAttempts) {
        this.totalConcurrentAttempts = totalConcurrentAttempts;
    }

    public int getSuccessfulBookings() {
        return successfulBookings;
    }

    public void setSuccessfulBookings(int successfulBookings) {
        this.successfulBookings = successfulBookings;
    }

    public int getPreventedOverbookings() {
        return preventedOverbookings;
    }

    public void setPreventedOverbookings(int preventedOverbookings) {
        this.preventedOverbookings = preventedOverbookings;
    }

    public long getTotalDurationMs() {
        return totalDurationMs;
    }

    public void setTotalDurationMs(long totalDurationMs) {
        this.totalDurationMs = totalDurationMs;
    }

    public String getIsolationGuarantee() {
        return isolationGuarantee;
    }

    public void setIsolationGuarantee(String isolationGuarantee) {
        this.isolationGuarantee = isolationGuarantee;
    }

    public List<ThreadAttemptLog> getLogs() {
        return logs;
    }

    public void setLogs(List<ThreadAttemptLog> logs) {
        this.logs = logs;
    }
}
