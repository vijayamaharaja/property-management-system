package com.test89.property_catalog_service.security;

import com.test89.property_catalog_service.entity.Property;
import com.test89.property_catalog_service.entity.User;
import com.test89.property_catalog_service.repository.PropertyRepository;
import com.test89.property_catalog_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("propertySecurity")
@RequiredArgsConstructor
public class PropertySecurity {
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public boolean isOwner(Long propertyId, String username) {
        Property property = propertyRepository.findById(propertyId).orElse(null);
        User user = userRepository.findByUsername(username).orElse(null);
        return property != null && user != null && property.getOwner().getId().equals(user.getId());
    }
}