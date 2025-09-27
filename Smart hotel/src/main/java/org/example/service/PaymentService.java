package org.example.service;

import org.example.entity.Booking;
import org.example.entity.Payment;
import org.example.enums.BookingStatus;
import org.example.enums.PaymentMethod;
import org.example.exceptions.ResourceNotFoundException;
import org.example.repository.BookingRepository;
import org.example.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private LoyaltyService loyaltyService;

    public Payment createPayment(Map<String, Object> paymentData, String userEmail) {
        Long bookingId = Long.valueOf(paymentData.get("bookingId").toString());
        Double amount = Double.valueOf(paymentData.get("amount").toString());
        String method = paymentData.get("method").toString();
        String details = paymentData.get("details").toString();

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to pay for this booking");
        }

        Payment payment = Payment.builder()
                .booking(booking)
                .userEmail(userEmail)
                .amount(amount)
                .method(PaymentMethod.valueOf(method.toUpperCase()))
                .details(details)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        booking.setStatus(BookingStatus.PAID);
        bookingRepository.save(booking);

        loyaltyService.awardPoints(userEmail, (int) (amount * 0.1), "Booking payment");

        return savedPayment;
    }

    public List<Payment> getUserPayments(String userEmail) {
        return paymentRepository.findByUserEmail(userEmail);
    }
}