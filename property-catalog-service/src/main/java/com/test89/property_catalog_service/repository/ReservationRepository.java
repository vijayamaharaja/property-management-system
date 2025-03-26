package com.test89.property_catalog_service.repository;

import com.test89.property_catalog_service.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Page<Reservation> findByUserId(Long userId, Pageable pageable);

    Page<Reservation> findByPropertyId(Long propertyId, Pageable pageable);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.checkInDate >= CURRENT_DATE ORDER BY r.checkInDate ASC")
    Page<Reservation> findUpcomingReservationsByUser(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.checkOutDate < CURRENT_DATE ORDER BY r.checkOutDate DESC")
    Page<Reservation> findPastReservationsByUser(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.status = :status")
    Page<Reservation> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status, Pageable pageable);

    @Query("SELECT r FROM Reservation r WHERE r.property.id = :propertyId AND " +
            "((r.checkInDate BETWEEN :start AND :end) OR " +
            "(r.checkOutDate BETWEEN :start AND :end) OR " +
            "(:start BETWEEN r.checkInDate AND r.checkOutDate) OR " +
            "(:end BETWEEN r.checkInDate AND r.checkOutDate)) AND " +
            "r.status IN ('PENDING', 'CONFIRMED')")
    List<Reservation> findOverlappingReservations(
            @Param("propertyId") Long propertyId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    @Query("SELECT r FROM Reservation r WHERE " +
            "r.property.id = :propertyId AND " +
            "r.status IN ('PENDING', 'CONFIRMED') AND " +
            "FUNCTION('YEAR', r.checkInDate) = :year AND " +
            "FUNCTION('MONTH', r.checkInDate) = :month")
    List<Reservation> findReservationsByPropertyAndMonth(
            @Param("propertyId") Long propertyId,
            @Param("year") int year,
            @Param("month") int month);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE " +
            "r.property.id = :propertyId AND " +
            "r.status NOT IN ('CANCELLED') AND " +
            "r.checkInDate <= CURRENT_DATE AND " +
            "r.checkOutDate >= CURRENT_DATE")
    long countCurrentReservationsByProperty(@Param("propertyId") Long propertyId);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE " +
            "r.property.owner.id = :ownerId AND " +
            "r.status = 'CONFIRMED' AND " +
            "r.checkInDate BETWEEN :startDate AND :endDate")
    long countConfirmedReservationsByOwnerAndDateRange(
            @Param("ownerId") Long ownerId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}