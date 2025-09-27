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
        Hotel hotel = Hotel.builder()
                .name((String) hotelData.get("name"))
                .location((String) hotelData.get("location"))
                .description((String) hotelData.get("description"))
                .managerEmail(managerEmail)
                .build();

        Hotel savedHotel = hotelRepository.save(hotel);

        roomRepository.save(Room.builder().hotel(savedHotel).type(RoomType.STANDARD).price(2000.0).available(10).build());
        roomRepository.save(Room.builder().hotel(savedHotel).type(RoomType.DELUXE).price(3000.0).available(5).build());
        roomRepository.save(Room.builder().hotel(savedHotel).type(RoomType.SUITE).price(5000.0).available(2).build());

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