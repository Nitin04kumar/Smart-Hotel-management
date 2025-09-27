package org.example.service;

import org.example.entity.Loyalty;
import org.example.entity.LoyaltyHistory;
import org.example.enums.LoyaltyHistoryType;
import org.example.repository.LoyaltyHistoryRepository;
import org.example.repository.LoyaltyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    }

    @Transactional
    public Loyalty redeemPoints(String userEmail, Integer points) {
        Loyalty loyalty = getUserLoyalty(userEmail);

        if (loyalty.getAvailable() < points) {
            throw new RuntimeException("Insufficient loyalty points");
        }

        loyalty.setAvailable(loyalty.getAvailable() - points);
        loyalty.setTotalRedeemed(loyalty.getTotalRedeemed() + points);

        loyaltyRepository.save(loyalty);

        LoyaltyHistory history = LoyaltyHistory.builder()
                .loyalty(loyalty)
                .type(LoyaltyHistoryType.REDEEMED)
                .points(points)
                .description("Points redemption")
                .build();
        loyaltyHistoryRepository.save(history);

        return loyalty;
    }

    private Loyalty createLoyaltyAccount(String userEmail) {
        Loyalty loyalty = Loyalty.builder()
                .userEmail(userEmail)
                .build();
        return loyaltyRepository.save(loyalty);
    }
}