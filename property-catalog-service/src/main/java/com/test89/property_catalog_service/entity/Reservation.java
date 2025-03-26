package com.test89.property_catalog_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "reservations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    public Property property;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(nullable = false)
    private LocalDate checkOutDate;

    @Column(nullable = false)
    private Integer numberOfDays; // Total number of days for the reservation

    @Column(nullable = false)
    private BigDecimal pricePerDay; // Price per day at time of reservation (copied from property)

    @Column(nullable = false)
    private BigDecimal totalPrice; // Total price for the entire stay

    private BigDecimal cleaningFee; // Optional cleaning fee
    private BigDecimal serviceFee;  // Optional service fee
    private BigDecimal taxAmount;   // Tax amount if applicable

    @Column(nullable = false)
    private Integer guestCount; // Number of guests for this reservation

    @Column(nullable = false)
    private String status; // PENDING, CONFIRMED, CANCELLED, COMPLETED, etc.

    private String specialRequests; // Any special requests from the guest
    private String cancellationReason; // Reason if cancelled

    // Payment tracking
    private Boolean isPaid;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String paymentReference;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        // Calculate number of days if not already set
        if (numberOfDays == null && checkInDate != null && checkOutDate != null) {
            numberOfDays = (int) ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        }

        // Calculate total price if needed
        if (totalPrice == null && pricePerDay != null && numberOfDays != null) {
            totalPrice = pricePerDay.multiply(BigDecimal.valueOf(numberOfDays));

            // Add fees if present
            if (cleaningFee != null) totalPrice = totalPrice.add(cleaningFee);
            if (serviceFee != null) totalPrice = totalPrice.add(serviceFee);
            if (taxAmount != null) totalPrice = totalPrice.add(taxAmount);
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}