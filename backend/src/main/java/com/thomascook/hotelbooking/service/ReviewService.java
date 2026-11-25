package com.thomascook.hotelbooking.service;

import com.thomascook.hotelbooking.dto.CreateReviewRequest;
import com.thomascook.hotelbooking.dto.ReviewDTO;
import com.thomascook.hotelbooking.entity.Hotel;
import com.thomascook.hotelbooking.entity.Review;
import com.thomascook.hotelbooking.exception.ResourceNotFoundException;
import com.thomascook.hotelbooking.repository.HotelRepository;
import com.thomascook.hotelbooking.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final HotelRepository hotelRepository;

    public ReviewService(ReviewRepository reviewRepository, HotelRepository hotelRepository) {
        this.reviewRepository = reviewRepository;
        this.hotelRepository = hotelRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByHotel(Long hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel not found with id: " + hotelId);
        }
        return reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO addReview(Long hotelId, CreateReviewRequest request) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));

        Review review = new Review();
        review.setHotel(hotel);
        review.setAuthorName(request.getAuthorName().trim());
        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());

        Review saved = reviewRepository.save(review);

        // Recalculate average hotel rating
        List<Review> allReviews = reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId);
        double avg = allReviews.stream()
                .mapToDouble(r -> r.getRating().doubleValue())
                .average()
                .orElse(hotel.getRating().doubleValue());

        hotel.setRating(BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP));
        hotelRepository.save(hotel);

        return mapToDTO(saved);
    }

    private ReviewDTO mapToDTO(Review review) {
        return new ReviewDTO(
                review.getId(),
                review.getHotel().getId(),
                review.getAuthorName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
