package org.example.repository;

import org.example.entity.LoyaltyHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoyaltyHistoryRepository extends JpaRepository<LoyaltyHistory, Long> {
    List<LoyaltyHistory> findByLoyaltyUserEmailOrderByDateDesc(String userEmail);
}