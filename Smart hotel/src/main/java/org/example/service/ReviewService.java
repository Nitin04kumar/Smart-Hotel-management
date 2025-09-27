package org.example.service;

import org.example.entity.Booking;
import org.example.entity.Hotel;
import org.example.entity.Review;
import org.example.exceptions.ResourceNotFoundException;
import org.example.repository.BookingRepository;
import org.example.repository.HotelRepository;
import org.example.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private LoyaltyService loyaltyService;

    public Review addReview(Map<String, Object> reviewData, String userEmail) {
        Long bookingId = Long.valueOf(reviewData.get("bookingId").toString());
        Long hotelId = Long.valueOf(reviewData.get("hotelId").toString());
        Integer rating = Integer.valueOf(reviewData.get("rating").toString());
        String comment = (String) reviewData.get("comment");

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));

        if (!booking.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to review this booking");
        }

        Review review = Review.builder()
                .booking(booking)
                .hotel(hotel)
                .userEmail(userEmail)
                .rating(rating)
                .comment(comment)
                .build();

        Review savedReview = reviewRepository.save(review);

        loyaltyService.awardPoints(userEmail, 50, "Hotel review");

        updateHotelRating(hotel);

        return savedReview;
    }

    public List<Review> getUserReviews(String userEmail) {
        return reviewRepository.findByUserEmail(userEmail);
    }

    public List<Review> getHotelReviews(Long hotelId) {
        return reviewRepository.findByHotelId(hotelId);
    }

    private void updateHotelRating(Hotel hotel) {
        List<Review> reviews = reviewRepository.findByHotelId(hotel.getId());
        if (!reviews.isEmpty()) {
            double avgRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            hotel.setRating(avgRating);
            hotelRepository.save(hotel);
        }
    }
}