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

    // No restrictions, public method
    @Transactional(readOnly = true)
    public Page<PropertyDto> searchProperties(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer bedrooms,
            Integer bathrooms,
            String city,
            Pageable pageable) {
        return propertyRepository.findByFilters(minPrice, maxPrice, bedrooms, bathrooms, city, pageable)
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
    @PreAuthorize("hasRole('ADMIN') or @propertySecurity.isOwner(#ownerId, authentication.name)") // TODO check if this is correct    public Page<PropertyDto> getPropertiesByOwner(Long ownerId, Pageable pageable) {
    // TODO need to check if this is correct as intended
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
    public PropertyDto updateProperty(Long id, PropertyDto propertyDto, String username) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        // TODO: Can be removed as currently controlled from SpringSecurity - MethodSecurity
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
//
//        // Check if the current user is the owner or an admin
//        if (!property.getOwner().getId().equals(user.getId()) &&
//                !user.getRoles().contains("ROLE_ADMIN")) {
//            throw new AccessDeniedException("You don't have permission to update this property");
//        }
//
        propertyMapper.updateEntityFromDto(propertyDto, property);
        Property updatedProperty = propertyRepository.save(property);
        return propertyMapper.toDto(updatedProperty);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN') or @propertySecurity.isOwner(#id, authentication.name)")
    public void deleteProperty(Long id, String username) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        // TODO can be removed as above
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
//
//        // Check if the current user is the owner or an admin
//        if (!property.getOwner().getId().equals(user.getId()) &&
//                !user.getRoles().contains("ROLE_ADMIN")) {
//            throw new AccessDeniedException("You don't have permission to delete this property");
//        }

        propertyRepository.delete(property);
    }
}
