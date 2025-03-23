package com.test89.property_catalog_service.controller;

import com.test89.property_catalog_service.dto.PropertyDto;
import com.test89.property_catalog_service.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/properties")
@Tag(name = "Properties", description = "APIs for managing and querying properties")
public class PropertyController {

    private final PropertyService propertyService;

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

    @Operation(summary = "Get all properties (requires authentication)")
    @GetMapping
    public ResponseEntity<Page<PropertyDto>> getAllProperties(Pageable pageable) {
        return ResponseEntity.ok(propertyService.getAllProperties(pageable));
    }

    @Operation(summary = "Get properties owned by a specific user")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<Page<PropertyDto>> getPropertiesByOwner(
            @PathVariable Long ownerId, Pageable pageable) {
        return ResponseEntity.ok(propertyService.getPropertiesByOwner(ownerId, pageable));
    }

    @Operation(summary = "Create a new property")
    @PostMapping
    public ResponseEntity<PropertyDto> createProperty(
            @Valid @RequestBody PropertyDto propertyDto, Authentication authentication) {
        PropertyDto createdProperty = propertyService.createProperty(propertyDto, authentication.getName());
        return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing property by ID")
    @PutMapping("/{id}")
    public ResponseEntity<PropertyDto> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyDto propertyDto,
            Authentication authentication) {
        PropertyDto updatedProperty = propertyService.updateProperty(id, propertyDto, authentication.getName());
        return ResponseEntity.ok(updatedProperty);
    }

    @Operation(summary = "Delete a property by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id, Authentication authentication) {
        propertyService.deleteProperty(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}