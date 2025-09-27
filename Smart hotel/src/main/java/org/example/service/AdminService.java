package org.example.service;

import org.example.entity.Hotel;
import org.example.entity.User;
import org.example.enums.HotelStatus;
import org.example.exceptions.ResourceNotFoundException;
import org.example.repository.BookingRepository;
import org.example.repository.HotelRepository;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Hotel> getPendingHotels() {
        return hotelRepository.findByStatus(HotelStatus.PENDING);
    }

    public String approveHotel(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));

        hotel.setStatus(HotelStatus.APPROVED);
        hotelRepository.save(hotel);

        return "Hotel approved successfully";
    }

    public String rejectHotel(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));

        hotel.setStatus(HotelStatus.REJECTED);
        hotelRepository.save(hotel);

        return "Hotel rejected successfully";
    }

    public Map<String, Object> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalHotels = hotelRepository.count();
        long totalBookings = bookingRepository.countAllBookings();
        Double totalRevenue = bookingRepository.sumTotalRevenue();

        return Map.of(
                "totalUsers", totalUsers,
                "totalHotels", totalHotels,
                "totalBookings", totalBookings,
                "totalRevenue", totalRevenue != null ? totalRevenue : 0.0
        );
    }
}