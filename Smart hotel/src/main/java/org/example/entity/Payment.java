package org.example.entity;

import org.example.enums.PaymentMethod;
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
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @NotNull
    private String userEmail;

    @NotNull
    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method;

    @Column(columnDefinition = "TEXT")
    private String details;

    @CreationTimestamp
    private LocalDateTime createdAt;
}