package com.thomascook.hotelbooking.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI hotelBookingOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Thomas Cook Hotel Booking Portal — REST API")
                        .description("Production-grade RESTful API for hotel discovery, real-time room availability, " +
                                "thread-safe reservation processing with pessimistic locking, and hotel comparison.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Thomas Cook Internship Assessment")
                                .email("developer.assessment@thomascook.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")));
    }
}
