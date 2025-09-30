package org.example.service;

import org.example.entity.Loyalty;
import org.example.entity.LoyaltyHistory;
import org.example.enums.LoyaltyHistoryType;
import org.example.repository.LoyaltyHistoryRepository;
import org.example.repository.LoyaltyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.mysql.cj.conf.PropertyKey.logger;

@Service
public class LoyaltyService {

    @Autowired
    private LoyaltyRepository loyaltyRepository;

    @Autowired
    private LoyaltyHistoryRepository loyaltyHistoryRepository;

    public Loyalty getUserLoyalty(String userEmail) {
        return loyaltyRepository.findByUserEmail(userEmail)
                .orElseGet(() -> createLoyaltyAccount(userEmail));
    }

    @Transactional
    public void awardPoints(String userEmail, Integer points, String description) {
        Loyalty loyalty = getUserLoyalty(userEmail);

        loyalty.setPoints(loyalty.getPoints() + points);
        loyalty.setAvailable(loyalty.getAvailable() + points);
        loyalty.setTotalEarned(loyalty.getTotalEarned() + points);

        loyaltyRepository.save(loyalty);

        LoyaltyHistory history = LoyaltyHistory.builder()
                .loyalty(loyalty)
                .type(LoyaltyHistoryType.EARNED)
                .points(points)
                .description(description)
                .build();
        loyaltyHistoryRepository.save(history);

        //logger.info("Awarded {} points to user: {}. Description: {}", points, userEmail, description);
    }

    @Transactional
    public Loyalty redeemPoints(String userEmail, Integer points, String description) {
        Loyalty loyalty = getUserLoyalty(userEmail);

        if (loyalty.getAvailable() < points) {
            throw new RuntimeException("Insufficient loyalty points. Available: " + loyalty.getAvailable() + ", Requested: " + points);
        }

        loyalty.setAvailable(loyalty.getAvailable() - points);
        loyalty.setTotalRedeemed(loyalty.getTotalRedeemed() + points);

        loyaltyRepository.save(loyalty);

        LoyaltyHistory history = LoyaltyHistory.builder()
                .loyalty(loyalty)
                .type(LoyaltyHistoryType.REDEEMED)
                .points(points)
                .description(description)
                .build();
        loyaltyHistoryRepository.save(history);

        //logger.info("Redeemed {} points from user: {}. Description: {}", points, userEmail, description);
        return loyalty;
    }

    @Transactional
    public Loyalty redeemPoints(String userEmail, Integer points) {
        return redeemPoints(userEmail, points, "Points redemption");
    }

    private Loyalty createLoyaltyAccount(String userEmail) {
        Loyalty loyalty = Loyalty.builder()
                .userEmail(userEmail)
                .points(0)
                .available(0)
                .totalEarned(0)
                .totalRedeemed(0)
                .build();
        Loyalty savedLoyalty = loyaltyRepository.save(loyalty);
        //logger.info("Created new loyalty account for user: {}", userEmail);
        return savedLoyalty;
    }

    // Helper method to calculate discount from loyalty points
    public Double calculateDiscountFromPoints(String userEmail, Integer pointsToUse) {
        Loyalty loyalty = getUserLoyalty(userEmail);

        if (pointsToUse > loyalty.getAvailable()) {
            throw new RuntimeException("Insufficient loyalty points. Available: " + loyalty.getAvailable());
        }

        // Convert points to currency (1 point = 1 currency unit)
        return pointsToUse.doubleValue();
    }
}