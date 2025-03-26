package com.test89.property_catalog_service.repository;

import com.test89.property_catalog_service.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    Page<Property> findByStatus(String status, Pageable pageable);

    Page<Property> findByType(String type, Pageable pageable);

    @Query("SELECT p FROM Property p WHERE " +
            "p.pricePerDay BETWEEN :minPrice AND :maxPrice " +
            "AND (:bedrooms IS NULL OR p.bedrooms >= :bedrooms) " +
            "AND (:bathrooms IS NULL OR p.bathrooms >= :bathrooms) " +
            "AND (:city IS NULL OR LOWER(p.address.city) = LOWER(:city)) " +
            "AND (:maxGuests IS NULL OR p.maxGuests >= :maxGuests)")
    Page<Property> findByBasicFilters(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("bedrooms") Integer bedrooms,
            @Param("bathrooms") Integer bathrooms,
            @Param("city") String city,
            @Param("maxGuests") Integer maxGuests,
            Pageable pageable);

    /**
     * Find properties that are available for the requested dates
     * by filtering out properties that have conflicting reservations
     */
    @Query("SELECT p FROM Property p WHERE " +
            "p.status = 'Available' AND " +
            "p.id NOT IN (" +
            "SELECT r.property.id FROM Reservation r WHERE " +
            "r.status IN ('PENDING', 'CONFIRMED') AND " +
            "((r.checkInDate <= :checkOutDate AND r.checkOutDate >= :checkInDate))" +
            ") AND " +
            "(:minPrice IS NULL OR p.pricePerDay >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.pricePerDay <= :maxPrice) AND " +
            "(:bedrooms IS NULL OR p.bedrooms >= :bedrooms) AND " +
            "(:bathrooms IS NULL OR p.bathrooms >= :bathrooms) AND " +
            "(:city IS NULL OR LOWER(p.address.city) = LOWER(:city)) AND " +
            "(:guestCount IS NULL OR p.maxGuests >= :guestCount) AND " +
            "(:minStayDays IS NULL OR p.minStayDays <= :stayDuration) AND " +
            "(:maxStayDays IS NULL OR p.maxStayDays >= :stayDuration OR p.maxStayDays IS NULL)")
    Page<Property> findAvailableProperties(
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("bedrooms") Integer bedrooms,
            @Param("bathrooms") Integer bathrooms,
            @Param("city") String city,
            @Param("guestCount") Integer guestCount,
            @Param("minStayDays") Integer minStayDays,
            @Param("maxStayDays") Integer maxStayDays,
            @Param("stayDuration") Integer stayDuration,
            Pageable pageable);

    /**
     * Find available properties for specific dates with pet and guest requirements
     */
    @Query("SELECT p FROM Property p WHERE " +
            "p.status = 'Available' AND " +
            "p.id NOT IN (" +
            "SELECT r.property.id FROM Reservation r WHERE " +
            "r.status IN ('PENDING', 'CONFIRMED') AND " +
            "((r.checkInDate <= :checkOutDate AND r.checkOutDate >= :checkInDate))" +
            ") " +
            "AND (:petsAllowed IS NULL OR p.petsAllowed = :petsAllowed) " +
            "AND (:maxGuests IS NULL OR p.maxGuests >= :maxGuests)")
    Page<Property> findAvailablePropertiesForDates(
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate,
            @Param("petsAllowed") Boolean petsAllowed,
            @Param("maxGuests") Integer maxGuests,
            Pageable pageable);

    Page<Property> findByOwnerId(Long ownerId, Pageable pageable);
}