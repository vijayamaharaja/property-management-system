package com.test89.property_catalog_service.exception;

public class PropertyNotFoundException extends RuntimeException {
    public PropertyNotFoundException(Long id) {
        super("Property not found with id: " + id);
    }
}
