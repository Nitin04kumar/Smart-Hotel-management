package org.example.controller;

import org.example.entity.Booking;
import org.example.entity.Hotel;
import org.example.entity.Review;
import org.example.service.ManagerService;
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
@RequestMapping("/api/manager")
@CrossOrigin(origins = {"http://localhost:5173"})
public class ManagerController {

    private static final Logger logger = LoggerFactory.getLogger(ManagerController.class);

    @Autowired
    private ManagerService managerService;

    @PostMapping("/hotels")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Hotel> addHotel(@RequestBody Map<String, Object> hotelData,
                                          Authentication authentication) {
        try {
            return ResponseEntity.ok(managerService.addHotel(hotelData, authentication.getName()));
        } catch (Exception e) {
            logger.error("Error adding hotel: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/hotels")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Hotel>> getManagerHotels(Authentication authentication) {
        try {
            return ResponseEntity.ok(managerService.getManagerHotels(authentication.getName()));
        } catch (Exception e) {
            logger.error("Error getting manager hotels: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Booking>> getManagerBookings(Authentication authentication) {
        try {
            return ResponseEntity.ok(managerService.getManagerBookings(authentication.getName()));
        } catch (Exception e) {
            logger.error("Error getting manager bookings: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/reviews")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Review>> getManagerReviews(Authentication authentication) {
        try {
            return ResponseEntity.ok(managerService.getManagerReviews(authentication.getName()));
        } catch (Exception e) {
            logger.error("Error getting manager reviews: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/reviews/{id}/reply")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<String> replyToReview(@PathVariable Long id,
                                                @RequestBody Map<String, String> replyData,
                                                Authentication authentication) {
        try {
            return ResponseEntity.ok(managerService.replyToReview(id, authentication.getName(), replyData.get("reply")));
        } catch (Exception e) {
            logger.error("Error replying to review: ", e);
            return ResponseEntity.status(500).build();
        }
    }
}