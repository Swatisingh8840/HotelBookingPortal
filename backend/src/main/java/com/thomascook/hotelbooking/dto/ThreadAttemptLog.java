package com.thomascook.hotelbooking.dto;

import java.time.LocalDateTime;

public class ThreadAttemptLog {
    private int threadNumber;
    private String threadName;
    private String customerName;
    private String status; // "CONFIRMED" or "BLOCKED_409_PREVENTED"
    private String bookingReference;
    private String message;
    private long responseTimeMs;
    private LocalDateTime timestamp;

    public ThreadAttemptLog() {
    }

    public ThreadAttemptLog(int threadNumber, String threadName, String customerName, String status, String bookingReference, String message, long responseTimeMs, LocalDateTime timestamp) {
        this.threadNumber = threadNumber;
        this.threadName = threadName;
        this.customerName = customerName;
        this.status = status;
        this.bookingReference = bookingReference;
        this.message = message;
        this.responseTimeMs = responseTimeMs;
        this.timestamp = timestamp;
    }

    public int getThreadNumber() {
        return threadNumber;
    }

    public void setThreadNumber(int threadNumber) {
        this.threadNumber = threadNumber;
    }

    public String getThreadName() {
        return threadName;
    }

    public void setThreadName(String threadName) {
        this.threadName = threadName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getResponseTimeMs() {
        return responseTimeMs;
    }

    public void setResponseTimeMs(long responseTimeMs) {
        this.responseTimeMs = responseTimeMs;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
