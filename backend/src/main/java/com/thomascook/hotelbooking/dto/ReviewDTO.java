package com.thomascook.hotelbooking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReviewDTO {
    private Long id;
    private Long hotelId;
    private String authorName;
    private BigDecimal rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDTO() {
    }

    public ReviewDTO(Long id, Long hotelId, String authorName, BigDecimal rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.hotelId = hotelId;
        this.authorName = authorName;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
