package com.test89.property_catalog_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertySummaryDto {
    private Long id;
    private String title;
    private String type;
    private BigDecimal pricePerDay;
    private Integer maxGuests;
    private AddressDto address;
    private String imageUrl; // Primary image URL
}