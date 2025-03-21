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

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private Integer bedrooms;
    private Integer bathrooms;
    private Double area;

    @NotNull(message = "Address is required")
    private AddressDto address;

    private Set<String> amenities = new HashSet<>();
    private Set<String> imageUrls = new HashSet<>();

    @NotBlank(message = "Status is required")
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserSummaryDto owner;
}
