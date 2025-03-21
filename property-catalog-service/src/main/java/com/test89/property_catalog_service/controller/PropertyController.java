package com.test89.property_catalog_service.controller;

import com.test89.property_catalog_service.dto.PropertyDto;
import com.test89.property_catalog_service.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping("/public")
    public ResponseEntity<Page<PropertyDto>> getAvailableProperties(Pageable pageable) {
        return ResponseEntity.ok(propertyService.getAvailableProperties(pageable));
    }

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

    @GetMapping("/public/type/{type}")
    public ResponseEntity<Page<PropertyDto>> getPropertiesByType(
            @PathVariable String type, Pageable pageable) {
        return ResponseEntity.ok(propertyService.getPropertiesByType(type, pageable));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<PropertyDto> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @GetMapping
    public ResponseEntity<Page<PropertyDto>> getAllProperties(Pageable pageable) {
        return ResponseEntity.ok(propertyService.getAllProperties(pageable));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<Page<PropertyDto>> getPropertiesByOwner(
            @PathVariable Long ownerId, Pageable pageable) {
        return ResponseEntity.ok(propertyService.getPropertiesByOwner(ownerId, pageable));
    }

    @PostMapping
    public ResponseEntity<PropertyDto> createProperty(
            @Valid @RequestBody PropertyDto propertyDto, Authentication authentication) {
        PropertyDto createdProperty = propertyService.createProperty(propertyDto, authentication.getName());
        return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDto> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyDto propertyDto,
            Authentication authentication) {
        PropertyDto updatedProperty = propertyService.updateProperty(id, propertyDto, authentication.getName());
        return ResponseEntity.ok(updatedProperty);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id, Authentication authentication) {
        propertyService.deleteProperty(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}