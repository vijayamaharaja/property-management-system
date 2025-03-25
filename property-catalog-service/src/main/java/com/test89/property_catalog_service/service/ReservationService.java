package com.test89.property_catalog_service.service;

import com.test89.property_catalog_service.dto.ReservationCreateDto;
import com.test89.property_catalog_service.dto.ReservationDto;
import com.test89.property_catalog_service.entity.Property;
import com.test89.property_catalog_service.entity.Reservation;
import com.test89.property_catalog_service.entity.User;
import com.test89.property_catalog_service.exception.ResourceNotFoundException;
import com.test89.property_catalog_service.mapper.ReservationMapper;
import com.test89.property_catalog_service.repository.PropertyRepository;
import com.test89.property_catalog_service.repository.ReservationRepository;
import com.test89.property_catalog_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;
    private final EmailService emailService;

    @Transactional
    public ReservationDto createReservation(ReservationCreateDto createDto, String username) {
        // Find the user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Find the property
        Property property = propertyRepository.findById(createDto.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + createDto.getPropertyId()));

        // Check if the property is available
        if (!"Available".equals(property.getStatus())) {
            throw new IllegalStateException("Property is not available for booking");
        }

        // Check for overlapping reservations
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(
                property.getId(), createDto.getCheckInDate(), createDto.getCheckOutDate());

        if (!overlappingReservations.isEmpty()) {
            throw new IllegalStateException("The property is already booked for the selected dates");
        }

        // Calculate total price
        long days = ChronoUnit.DAYS.between(createDto.getCheckInDate(), createDto.getCheckOutDate());
        if (days <= 0) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }

        BigDecimal totalPrice = property.getPrice().multiply(BigDecimal.valueOf(days));

        // Create reservation
        Reservation reservation = Reservation.builder()
                .property(property)
                .user(user)
                .checkInDate(createDto.getCheckInDate())
                .checkOutDate(createDto.getCheckOutDate())
                .totalPrice(totalPrice)
                .status("PENDING") // Initial status
                .specialRequests(createDto.getSpecialRequests())
                .guestCount(createDto.getGuestCount())
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);

        // Send confirmation email
        try {
            sendReservationConfirmationEmail(savedReservation);
        } catch (Exception e) {
            // Log error but don't fail the reservation
            System.err.println("Failed to send reservation confirmation email: " + e.getMessage());
        }

        return reservationMapper.toDto(savedReservation);
    }

    @Transactional(readOnly = true)
    public ReservationDto getReservationById(Long id, String username) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        // Check if user has access to this reservation
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean isAdmin = user.getRoles().contains("ROLE_ADMIN");
        boolean isOwner = reservation.getUser().getId().equals(user.getId());
        boolean isPropertyOwner = reservation.getProperty().getOwner().getId().equals(user.getId());

        if (!isAdmin && !isOwner && !isPropertyOwner) {
            throw new AccessDeniedException("You don't have permission to view this reservation");
        }

        return reservationMapper.toDto(reservation);
    }

    @Transactional(readOnly = true)
    public Page<ReservationDto> getUserReservations(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return reservationRepository.findByUserId(user.getId(), pageable)
                .map(reservationMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ReservationDto> getUpcomingReservations(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return reservationRepository.findUpcomingReservationsByUser(user.getId(), pageable)
                .map(reservationMapper::toDto);
    }

    @Transactional
    public ReservationDto updateReservationStatus(Long id, String status, String username) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean isAdmin = user.getRoles().contains("ROLE_ADMIN");
        boolean isPropertyOwner = reservation.getProperty().getOwner().getId().equals(user.getId());

        // Only admin, property owner, or the user who made the reservation (for cancellations only) can update status
        boolean isReservationOwner = reservation.getUser().getId().equals(user.getId());
        boolean isAllowedUpdate = isAdmin || isPropertyOwner || (isReservationOwner && "CANCELLED".equals(status));

        if (!isAllowedUpdate) {
            throw new AccessDeniedException("You don't have permission to update this reservation");
        }

        // Update the status
        reservation.setStatus(status);
        Reservation updatedReservation = reservationRepository.save(reservation);

        // Send status update email
        try {
            sendReservationStatusUpdateEmail(updatedReservation);
        } catch (Exception e) {
            // Log error but don't fail the update
            System.err.println("Failed to send reservation status update email: " + e.getMessage());
        }

        return reservationMapper.toDto(updatedReservation);
    }

    @Transactional(readOnly = true)
    public Page<ReservationDto> getPropertyReservations(Long propertyId, String username, Pageable pageable) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean isAdmin = user.getRoles().contains("ROLE_ADMIN");
        boolean isPropertyOwner = property.getOwner().getId().equals(user.getId());

        if (!isAdmin && !isPropertyOwner) {
            throw new AccessDeniedException("You don't have permission to view reservations for this property");
        }

        return reservationRepository.findByPropertyId(propertyId, pageable)
                .map(reservationMapper::toDto);
    }

    @Transactional(readOnly = true)
    public boolean isPropertyAvailable(Long propertyId, LocalDate checkInDate, LocalDate checkOutDate) {
        // Validate input dates
        if (checkInDate.isAfter(checkOutDate)) {
            throw new IllegalArgumentException("Check-in date cannot be after check-out date");
        }

        if (checkInDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Check-in date cannot be in the past");
        }

        // Check if property exists and is available for booking
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        if (!"Available".equals(property.getStatus())) {
            return false;
        }

        // Check for overlapping reservations
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(
                propertyId, checkInDate, checkOutDate);

        return overlappingReservations.isEmpty();
    }

    @Transactional
    public void cancelReservation(Long id, String username) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean isAdmin = user.getRoles().contains("ROLE_ADMIN");
        boolean isPropertyOwner = reservation.getProperty().getOwner().getId().equals(user.getId());
        boolean isReservationOwner = reservation.getUser().getId().equals(user.getId());

        if (!isAdmin && !isPropertyOwner && !isReservationOwner) {
            throw new AccessDeniedException("You don't have permission to cancel this reservation");
        }

        // Set status to cancelled
        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);

        // Send cancellation email
        try {
            sendReservationCancellationEmail(reservation);
        } catch (Exception e) {
            // Log error but don't fail the cancellation
            System.err.println("Failed to send reservation cancellation email: " + e.getMessage());
        }
    }

    private void sendReservationConfirmationEmail(Reservation reservation) {
        String subject = "Reservation Confirmation - Property Management System";
        String body = "<h3>Hi " + reservation.getUser().getFirstName() + ",</h3>" +
                "<p>Your reservation has been confirmed with the following details:</p>" +
                "<p><b>Property:</b> " + reservation.getProperty().getTitle() + "</p>" +
                "<p><b>Check-in Date:</b> " + reservation.getCheckInDate() + "</p>" +
                "<p><b>Check-out Date:</b> " + reservation.getCheckOutDate() + "</p>" +
                "<p><b>Total Price:</b> £" + reservation.getTotalPrice() + "</p>" +
                "<p><b>Status:</b> " + reservation.getStatus() + "</p>" +
                "<br><p>Thanks,<br>Property Management Team</p>";

        emailService.sendEmail(reservation.getUser().getEmail(), subject, body);
    }

    private void sendReservationStatusUpdateEmail(Reservation reservation) {
        String subject = "Reservation Status Update - Property Management System";
        String body = "<h3>Hi " + reservation.getUser().getFirstName() + ",</h3>" +
                "<p>Your reservation status has been updated to: <b>" + reservation.getStatus() + "</b></p>" +
                "<p><b>Property:</b> " + reservation.getProperty().getTitle() + "</p>" +
                "<p><b>Check-in Date:</b> " + reservation.getCheckInDate() + "</p>" +
                "<p><b>Check-out Date:</b> " + reservation.getCheckOutDate() + "</p>" +
                "<br><p>Thanks,<br>Property Management Team</p>";

        emailService.sendEmail(reservation.getUser().getEmail(), subject, body);
    }

    private void sendReservationCancellationEmail(Reservation reservation) {
        String subject = "Reservation Cancellation - Property Management System";
        String body = "<h3>Hi " + reservation.getUser().getFirstName() + ",</h3>" +
                "<p>Your reservation has been cancelled:</p>" +
                "<p><b>Property:</b> " + reservation.getProperty().getTitle() + "</p>" +
                "<p><b>Check-in Date:</b> " + reservation.getCheckInDate() + "</p>" +
                "<p><b>Check-out Date:</b> " + reservation.getCheckOutDate() + "</p>" +
                "<br><p>Thanks,<br>Property Management Team</p>";

        emailService.sendEmail(reservation.getUser().getEmail(), subject, body);
    }
}