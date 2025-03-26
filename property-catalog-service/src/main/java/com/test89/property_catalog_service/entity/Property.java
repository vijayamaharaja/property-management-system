package com.test89.property_catalog_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "properties")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String type; // Apartment, House, Commercial, etc.

    @Column(nullable = false)
    private BigDecimal pricePerDay; // Changed from price to pricePerDay

    private Integer bedrooms;
    private Integer bathrooms;
    private Double area; // in square meters/feet

    private Integer maxGuests; // Maximum number of guests allowed
    private Integer minStayDays; // Minimum stay duration in days
    private Integer maxStayDays; // Maximum stay duration in days (optional)

    @Embedded
    private Address address;

    @ElementCollection
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    private Set<String> amenities = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url")
    private Set<String> imageUrls = new HashSet<>();

    // Rental property availability status
    @Column(nullable = false)
    private String status; // Available, Maintenance, Unavailable, etc.

    // Property rules and policies
    private Boolean petsAllowed;
    private Boolean smokingAllowed;
    private Boolean partiesAllowed;
    private String checkInTime; // Default check-in time (e.g., "14:00")
    private String checkOutTime; // Default check-out time (e.g., "11:00")

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL)
    private List<Reservation> reservations = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}