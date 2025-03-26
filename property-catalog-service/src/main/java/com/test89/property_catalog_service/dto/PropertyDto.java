package com.test89.property_catalog_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Property type is required")
    private String type;

    @NotNull(message = "Price per day is required")
    @Positive(message = "Price per day must be positive")
    private BigDecimal pricePerDay;

    private Integer bedrooms;
    private Integer bathrooms;
    private Double area;

    private Integer maxGuests;
    private Integer minStayDays;
    private Integer maxStayDays;

    @NotNull(message = "Address is required")
    private AddressDto address;

    private Set<String> amenities = new HashSet<>();
    private Set<String> imageUrls = new HashSet<>();

    @NotBlank(message = "Status is required")
    private String status;

    // Property rules and policies
    private Boolean petsAllowed;
    private Boolean smokingAllowed;
    private Boolean partiesAllowed;
    private String checkInTime;
    private String checkOutTime;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserSummaryDto owner;
}