package com.thomascook.hotelbooking.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thomascook.hotelbooking.dto.BookingResponseDTO;
import com.thomascook.hotelbooking.dto.CancelBookingRequest;
import com.thomascook.hotelbooking.dto.CreateBookingRequest;
import com.thomascook.hotelbooking.exception.ResourceNotFoundException;
import com.thomascook.hotelbooking.service.BookingService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookingService bookingService;

    @Test
    @DisplayName("POST /api/v1/bookings - Should create booking and return 201 Created")
    void shouldCreateBookingSuccessfully() throws Exception {
        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(4);

        CreateBookingRequest request = new CreateBookingRequest(
                101L, "John Doe", "john@example.com", checkIn, checkOut
        );

        BookingResponseDTO response = new BookingResponseDTO();
        response.setBookingReference("TC-BK-554433");
        response.setCustomerName("John Doe");
        response.setCustomerEmail("john@example.com");
        response.setTotalNights(2);
        response.setTotalPrice(new BigDecimal("440.00"));
        response.setStatus("CONFIRMED");

        when(bookingService.createBooking(any(CreateBookingRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/bookings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookingReference").value("TC-BK-554433"))
                .andExpect(jsonPath("$.customerName").value("John Doe"))
                .andExpect(jsonPath("$.totalPrice").value(440.00))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    @DisplayName("POST /api/v1/bookings - Should return 400 Bad Request when customer email is invalid")
    void shouldReturn400WhenEmailIsInvalid() throws Exception {
        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(4);

        CreateBookingRequest request = new CreateBookingRequest(
                101L, "John Doe", "not-a-valid-email", checkIn, checkOut
        );

        mockMvc.perform(post("/api/v1/bookings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors.customerEmail").exists());
    }

    @Test
    @DisplayName("GET /api/v1/bookings/lookup - Should return 200 OK when booking is found")
    void shouldLookupBookingSuccessfully() throws Exception {
        BookingResponseDTO response = new BookingResponseDTO();
        response.setBookingReference("TC-BK-100201");
        response.setCustomerName("Emma Watson");
        response.setCustomerEmail("emma@paris.com");
        response.setStatus("CONFIRMED");

        when(bookingService.getBookingByReferenceAndEmail("TC-BK-100201", "emma@paris.com")).thenReturn(response);

        mockMvc.perform(get("/api/v1/bookings/lookup")
                .param("reference", "TC-BK-100201")
                .param("email", "emma@paris.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingReference").value("TC-BK-100201"))
                .andExpect(jsonPath("$.customerName").value("Emma Watson"));
    }

    @Test
    @DisplayName("GET /api/v1/bookings/lookup - Should return 404 Not Found when booking does not exist")
    void shouldReturn404WhenBookingNotFound() throws Exception {
        when(bookingService.getBookingByReferenceAndEmail("TC-BK-999999", "ghost@example.com"))
                .thenThrow(new ResourceNotFoundException("No booking found"));

        mockMvc.perform(get("/api/v1/bookings/lookup")
                .param("reference", "TC-BK-999999")
                .param("email", "ghost@example.com"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    @Test
    @DisplayName("POST /api/v1/bookings/{ref}/cancel - Should return 200 OK with CANCELLED status")
    void shouldCancelBookingSuccessfully() throws Exception {
        CancelBookingRequest request = new CancelBookingRequest("emma@paris.com");

        BookingResponseDTO response = new BookingResponseDTO();
        response.setBookingReference("TC-BK-100201");
        response.setStatus("CANCELLED");

        when(bookingService.cancelBooking(eq("TC-BK-100201"), eq("emma@paris.com"))).thenReturn(response);

        mockMvc.perform(post("/api/v1/bookings/TC-BK-100201/cancel")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }
}
