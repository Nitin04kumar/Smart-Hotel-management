package org.example.controller;

import org.example.dto.Request.BookingRequest;
import org.example.dto.Response.BookingResponse;
import org.example.entity.Loyalty;
import org.example.entity.Payment;
import org.example.entity.Review;
import org.example.service.BookingService;
import org.example.service.LoyaltyService;
import org.example.service.PaymentService;
import org.example.service.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173"})
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private LoyaltyService loyaltyService;

    @PostMapping("/bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request,
                                                         Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            BookingResponse booking = bookingService.createBooking(request, userEmail);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            logger.error("Error creating booking: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<BookingResponse>> getUserBookings(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<BookingResponse> bookings = bookingService.getUserBookings(userEmail);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            logger.error("Error getting user bookings: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/payments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> createPayment(@RequestBody Map<String, Object> paymentData,
                                                 Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Payment payment = paymentService.createPayment(paymentData, userEmail);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            logger.error("Error creating payment: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/payments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Payment>> getUserPayments(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<Payment> payments = paymentService.getUserPayments(userEmail);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            logger.error("Error getting user payments: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/reviews")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Review> addReview(@RequestBody Map<String, Object> reviewData,
                                            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Review review = reviewService.addReview(reviewData, userEmail);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            logger.error("Error adding review: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/reviews")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Review>> getUserReviews(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<Review> reviews = reviewService.getUserReviews(userEmail);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            logger.error("Error getting user reviews: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/loyalty")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Loyalty> getLoyalty(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Loyalty loyalty = loyaltyService.getUserLoyalty(userEmail);
            return ResponseEntity.ok(loyalty);
        } catch (Exception e) {
            logger.error("Error getting loyalty: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/loyalty/redeem")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Loyalty> redeemLoyalty(@RequestBody Map<String, Object> redeemData,
                                                 Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Integer points = (Integer) redeemData.get("points");
            Loyalty loyalty = loyaltyService.redeemPoints(userEmail, points);
            return ResponseEntity.ok(loyalty);
        } catch (Exception e) {
            logger.error("Error redeeming loyalty points: ", e);
            return ResponseEntity.status(500).build();
        }
    }
}