package org.example.repository;

import org.example.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserEmail(String userEmail);
    List<Review> findByHotelId(Long hotelId);

    @Query("SELECT r FROM Review r WHERE r.hotel.managerEmail = :managerEmail")
    List<Review> findByManagerEmail(String managerEmail);
}