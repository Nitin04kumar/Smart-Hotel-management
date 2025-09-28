package org.example.service;

import org.example.entity.Booking;
import org.example.entity.Hotel;
import org.example.entity.Review;
import org.example.entity.Room;
import org.example.enums.RoomType;
import org.example.exceptions.ResourceNotFoundException;
import org.example.repository.BookingRepository;
import org.example.repository.HotelRepository;
import org.example.repository.ReviewRepository;
import org.example.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ManagerService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Hotel addHotel(Map<String, Object> hotelData, String managerEmail) {
        // Extract hotel basic information
        String name = (String) hotelData.get("name");
        String location = (String) hotelData.get("location");
        String description = (String) hotelData.get("description");
        String imageUrl = (String) hotelData.get("imageUrl");
        
        // Extract amenities
        @SuppressWarnings("unchecked")
        List<String> amenities = (List<String>) hotelData.get("amenities");
        if (amenities == null) {
            amenities = new ArrayList<>();
        }
        
        // Extract rooms data
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> roomsData = (List<Map<String, Object>>) hotelData.get("rooms");
        if (roomsData == null) {
            roomsData = new ArrayList<>();
        }

        // Create hotel with images
        List<String> images = new ArrayList<>();
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            images.add(imageUrl);
        }

        Hotel hotel = Hotel.builder()
                .name(name)
                .location(location)
                .description(description)
                .images(images)
                .amenities(amenities)
                .managerEmail(managerEmail)
                .status(org.example.enums.HotelStatus.PENDING) // Set to pending for admin approval
                .build();

        Hotel savedHotel = hotelRepository.save(hotel);

        // Create rooms based on the provided data
        for (Map<String, Object> roomData : roomsData) {
            String roomTypeStr = (String) roomData.get("type");
            Double price = ((Number) roomData.get("price")).doubleValue();
            Integer available = ((Number) roomData.get("available")).intValue();
            
            RoomType roomType;
            try {
                roomType = RoomType.valueOf(roomTypeStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                roomType = RoomType.STANDARD; // Default fallback
            }
            
            Room room = Room.builder()
                    .hotel(savedHotel)
                    .type(roomType)
                    .price(price)
                    .available(available)
                    .build();
            
            roomRepository.save(room);
        }

        return savedHotel;
    }

    public List<Hotel> getManagerHotels(String managerEmail) {
        return hotelRepository.findByManagerEmail(managerEmail);
    }

    public List<Booking> getManagerBookings(String managerEmail) {
        return bookingRepository.findByManagerEmail(managerEmail);
    }

    public List<Review> getManagerReviews(String managerEmail) {
        return reviewRepository.findByManagerEmail(managerEmail);
    }

    public String replyToReview(Long reviewId, String managerEmail, String replyText) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        review.setReplyManagerEmail(managerEmail);
        review.setReplyText(replyText);
        review.setReplyCreatedAt(LocalDateTime.now());

        reviewRepository.save(review);

        return "Reply added successfully";
    }
}