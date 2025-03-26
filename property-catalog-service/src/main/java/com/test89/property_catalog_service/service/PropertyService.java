package com.test89.property_catalog_service.service;

import com.test89.property_catalog_service.dto.PropertyDto;
import com.test89.property_catalog_service.entity.Property;
import com.test89.property_catalog_service.entity.User;
import com.test89.property_catalog_service.exception.ResourceNotFoundException;
import com.test89.property_catalog_service.mapper.PropertyMapper;
import com.test89.property_catalog_service.repository.PropertyRepository;
import com.test89.property_catalog_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertyMapper propertyMapper;

    // Only authenticated users can access this
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public Page<PropertyDto> getAllProperties(Pageable pageable) {
        return propertyRepository.findAll(pageable)
                .map(propertyMapper::toDto);
    }

    // No restrictions, public method
    @Transactional(readOnly = true)
    public Page<PropertyDto> getAvailableProperties(Pageable pageable) {
        return propertyRepository.findByStatus("Available", pageable)
                .map(propertyMapper::toDto);
    }

    // No restrictions, public method
    @Transactional(readOnly = true)
    public Page<PropertyDto> getPropertiesByType(String type, Pageable pageable) {
        return propertyRepository.findByType(type, pageable)
                .map(propertyMapper::toDto);
    }

    // Basic search with price, bedrooms, bathrooms, city
    @Transactional(readOnly = true)
    public Page<PropertyDto> searchProperties(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer bedrooms,
            Integer bathrooms,
            String city,
            Integer maxGuests,
            Pageable pageable) {
        return propertyRepository.findByBasicFilters(
                        minPrice, maxPrice, bedrooms, bathrooms, city, maxGuests, pageable)
                .map(propertyMapper::toDto);
    }

    // Advanced search with date availability
    @Transactional(readOnly = true)
    public Page<PropertyDto> searchAvailableProperties(
            LocalDate checkInDate,
            LocalDate checkOutDate,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer bedrooms,
            Integer bathrooms,
            String city,
            Integer guestCount,
            Integer minStayDays,
            Integer maxStayDays,
            Pageable pageable) {

        // Validate dates
        if (checkInDate == null || checkOutDate == null) {
            throw new IllegalArgumentException("Check-in and check-out dates are required");
        }

        if (checkInDate.isAfter(checkOutDate)) {
            throw new IllegalArgumentException("Check-in date cannot be after check-out date");
        }

        // Calculate stay duration
        int stayDuration = (int) ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        if (stayDuration < 1) {
            throw new IllegalArgumentException("Stay duration must be at least 1 day");
        }

        return propertyRepository.findAvailableProperties(
                        checkInDate, checkOutDate,
                        minPrice, maxPrice,
                        bedrooms, bathrooms,
                        city, guestCount,
                        minStayDays, maxStayDays,
                        stayDuration,
                        pageable)
                .map(propertyMapper::toDto);
    }

    // Search with amenities and other filters
    @Transactional(readOnly = true)
    public Page<PropertyDto> searchPropertiesWithAmenities(
            LocalDate checkInDate,
            LocalDate checkOutDate,
            Set<String> amenities,
            Boolean petsAllowed,
            Integer maxGuests,
            Pageable pageable) {

        // Use empty set if null to avoid SQL errors
        Set<String> amenitiesSet = amenities != null ? amenities : new HashSet<>();

        return propertyRepository.findAvailablePropertiesWithAmenities(
                        checkInDate, checkOutDate, amenitiesSet, petsAllowed, maxGuests, pageable)
                .map(propertyMapper::toDto);
    }

    // No restrictions, public method
    @Transactional(readOnly = true)
    public PropertyDto getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
        return propertyMapper.toDto(property);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN') or @propertySecurity.isOwner(#ownerId, authentication.name)")
    public Page<PropertyDto> getPropertiesByOwner(Long ownerId, Pageable pageable) {
        return propertyRepository.findByOwnerId(ownerId, pageable)
                .map(propertyMapper::toDto);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public PropertyDto createProperty(PropertyDto propertyDto, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        Property property = propertyMapper.toEntity(propertyDto, owner);
        Property savedProperty = propertyRepository.save(property);
        return propertyMapper.toDto(savedProperty);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN') or @propertySecurity.isOwner(#id, authentication.name)")
    public PropertyDto updateProperty(Long id, PropertyDto propertyDto) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        propertyMapper.updateEntityFromDto(propertyDto, property);
        Property updatedProperty = propertyRepository.save(property);
        return propertyMapper.toDto(updatedProperty);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN') or @propertySecurity.isOwner(#id, authentication.name)")
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        propertyRepository.delete(property);
    }
}