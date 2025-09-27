package org.example.entity;

import org.example.enums.LoyaltyHistoryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "loyalty_history")
public class LoyaltyHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loyalty_id")
    private Loyalty loyalty;

    @Enumerated(EnumType.STRING)
    private LoyaltyHistoryType type;

    @NotNull
    private Integer points;

    @NotNull
    private String description;

    @CreationTimestamp
    private LocalDateTime date;
}