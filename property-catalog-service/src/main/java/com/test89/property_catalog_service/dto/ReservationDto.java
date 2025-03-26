package com.test89.property_catalog_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    private Long id;

    private PropertySummaryDto property;

    private UserSummaryDto user;

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date must be today or in the future")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;

    private Integer numberOfDays;

    @NotNull(message = "Price per day is required")
    @Positive(message = "Price per day must be positive")
    private BigDecimal pricePerDay;

    @NotNull(message = "Total price is required")
    @Positive(message = "Total price must be positive")
    private BigDecimal totalPrice;

    private BigDecimal cleaningFee;
    private BigDecimal serviceFee;
    private BigDecimal taxAmount;

    @Positive(message = "Guest count must be positive")
    private Integer guestCount;

    private String status;
    private String specialRequests;
    private String cancellationReason;

    private Boolean isPaid;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String paymentReference;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}