package org.example.controller;

import org.example.entity.Hotel;
import org.example.entity.User;
import org.example.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173"})
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            return ResponseEntity.ok(adminService.getAllUsers());
        } catch (Exception e) {
            logger.error("Error getting all users: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/hotels/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Hotel>> getPendingHotels() {
        try {
            return ResponseEntity.ok(adminService.getPendingHotels());
        } catch (Exception e) {
            logger.error("Error getting pending hotels: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/hotels/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> approveHotel(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.approveHotel(id));
        } catch (Exception e) {
            logger.error("Error approving hotel: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/hotels/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> rejectHotel(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.rejectHotel(id));
        } catch (Exception e) {
            logger.error("Error rejecting hotel: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            return ResponseEntity.ok(adminService.getDashboardStats());
        } catch (Exception e) {
            logger.error("Error getting dashboard stats: ", e);
            return ResponseEntity.status(500).build();
        }
    }
}