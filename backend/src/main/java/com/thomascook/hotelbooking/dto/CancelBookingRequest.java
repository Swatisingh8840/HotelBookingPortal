package com.thomascook.hotelbooking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CancelBookingRequest {

    @NotBlank(message = "Customer email is required for verification")
    @Email(message = "Please provide a valid email address")
    private String customerEmail;

    public CancelBookingRequest() {
    }

    public CancelBookingRequest(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
}
