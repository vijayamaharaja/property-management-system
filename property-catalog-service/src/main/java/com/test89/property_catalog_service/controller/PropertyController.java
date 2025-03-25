package com.test89.property_catalog_service.controller;

import com.test89.property_catalog_service.dto.AvailabilityResponseDto;
import com.test89.property_catalog_service.dto.PropertyDto;
import com.test89.property_catalog_service.service.PropertyService;
import com.test89.property_catalog_service.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/properties")
@Tag(name = "Properties", description = "APIs for managing and querying properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final ReservationService reservationService;

    @Operation(summary = "Get all available properties")
    @GetMapping("/public")
    public ResponseEntity<Page<PropertyDto>> getAvailableProperties(Pageable pageable) {
        return ResponseEntity.ok(propertyService.getAvailableProperties(pageable));
    }

    @Operation(summary = "Search properties by criteria")
    @GetMapping("/public/search")
    public ResponseEntity<Page<PropertyDto>> searchProperties(
            @RequestParam(required = false, defaultValue = "0") BigDecimal minPrice,
            @RequestParam(required = false, defaultValue = "1000000000") BigDecimal maxPrice,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Integer bathrooms,
            @RequestParam(required = false) String city,
            Pageable pageable) {
        return ResponseEntity.ok(propertyService.searchProperties(minPrice, maxPrice, bedrooms, bathrooms, city, pageable));
    }

    @Operation(summary = "Get properties by type")
    @GetMapping("/public/type/{type}")
    public ResponseEntity<Page<PropertyDto>> getPropertiesByType(
            @PathVariable String type, Pageable pageable) {
        return ResponseEntity.ok(propertyService.getPropertiesByType(type, pageable));
    }

    @Operation(summary = "Get property details by ID")
    @GetMapping("/public/{id}")
    public ResponseEntity<PropertyDto> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all properties (Only for authenticated users)")
    @GetMapping
    public ResponseEntity<Page<PropertyDto>> getAllProperties(Pageable pageable) {
        return ResponseEntity.ok(propertyService.getAllProperties(pageable));
    }

    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get properties owned by a specific user (Only for authenticated users)")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<Page<PropertyDto>> getPropertiesByOwner(
            @PathVariable Long ownerId, Pageable pageable) {
        return ResponseEntity.ok(propertyService.getPropertiesByOwner(ownerId, pageable));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new property (Only for admins)")
    @PostMapping
    public ResponseEntity<PropertyDto> createProperty(
            @Valid @RequestBody PropertyDto propertyDto, Authentication authentication) {
        PropertyDto createdProperty = propertyService.createProperty(propertyDto, authentication.getName());
        return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing property by ID (Only for admins)")
    @PutMapping("/{id}")
    public ResponseEntity<PropertyDto> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyDto propertyDto,
            Authentication authentication) {
        PropertyDto updatedProperty = propertyService.updateProperty(id, propertyDto);
        return ResponseEntity.ok(updatedProperty);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a property by ID (Only for admins)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id, Authentication authentication) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Check property availability for specific dates")
    @GetMapping("/{propertyId}/availability")
    public ResponseEntity<AvailabilityResponseDto> checkAvailability(
            @PathVariable Long propertyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {

        boolean isAvailable = reservationService.isPropertyAvailable(propertyId, checkInDate, checkOutDate);

        AvailabilityResponseDto response = new AvailabilityResponseDto(isAvailable);
        return ResponseEntity.ok(response);
    }

}