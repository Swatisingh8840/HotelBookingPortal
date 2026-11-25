package com.thomascook.hotelbooking.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class CreateReviewRequest {

    @NotBlank(message = "Reviewer name is required")
    @Size(min = 2, max = 150, message = "Author name must be between 2 and 150 characters")
    private String authorName;

    @NotNull(message = "Rating is required")
    @DecimalMin(value = "1.0", message = "Minimum rating is 1.0")
    @DecimalMax(value = "5.0", message = "Maximum rating is 5.0")
    private BigDecimal rating;

    @NotBlank(message = "Review comment is required")
    @Size(min = 5, max = 2000, message = "Comment must be between 5 and 2000 characters")
    private String comment;

    public CreateReviewRequest() {
    }

    public CreateReviewRequest(String authorName, BigDecimal rating, String comment) {
        this.authorName = authorName;
        this.rating = rating;
        this.comment = comment;
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
}
