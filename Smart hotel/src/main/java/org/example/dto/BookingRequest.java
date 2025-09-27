package org.example.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    @NotNull
    private Long hotelId;

    @NotNull
    private String roomType;

    @NotNull
    private String checkin;

    @NotNull
    private String checkout;

    @NotNull
    private Integer nights;

    @NotNull
    private Double pricePerNight;

    @NotNull
    private Double total;
}