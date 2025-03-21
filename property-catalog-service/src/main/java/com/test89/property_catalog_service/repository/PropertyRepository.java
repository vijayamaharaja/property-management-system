package com.test89.property_catalog_service.repository;

import com.test89.property_catalog_service.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    Page<Property> findByStatus(String status, Pageable pageable);

    Page<Property> findByType(String type, Pageable pageable);

    @Query("SELECT p FROM Property p WHERE " +
            "p.price BETWEEN :minPrice AND :maxPrice " +
            "AND (:bedrooms IS NULL OR p.bedrooms >= :bedrooms) " +
            "AND (:bathrooms IS NULL OR p.bathrooms >= :bathrooms) " +
            "AND (:city IS NULL OR LOWER(p.address.city) = LOWER(:city))")
    Page<Property> findByFilters(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("bedrooms") Integer bedrooms,
            @Param("bathrooms") Integer bathrooms,
            @Param("city") String city,
            Pageable pageable);

    Page<Property> findByOwnerId(Long ownerId, Pageable pageable);
}