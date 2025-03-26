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
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;
    private final EmailService emailService;

    // Fixed service fee percentage (can be moved to configuration)
    private static final BigDecimal SERVICE_FEE_PERCENTAGE = new BigDecimal("0.10"); // 10%
    private static final BigDecimal TAX_PERCENTAGE = new BigDecimal("0.05"); // 5%
    private static final BigDecimal CLEANING_FEE_BASE = new BigDecimal("25.00"); // Base cleaning fee

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

        // Validate dates
        validateReservationDates(createDto.getCheckInDate(), createDto.getCheckOutDate());

        // Calculate stay duration
        int stayDuration = (int) ChronoUnit.DAYS.between(createDto.getCheckInDate(), createDto.getCheckOutDate());

        // Validate against minimum and maximum stay requirements
        validateStayDuration(property, stayDuration);

        // Validate guest count
        validateGuestCount(property, createDto.getGuestCount());

        // Check for overlapping reservations
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(
                property.getId(), createDto.getCheckInDate(), createDto.getCheckOutDate());

        if (!overlappingReservations.isEmpty()) {
            throw new IllegalStateException("The property is already booked for the selected dates");
        }

        // Calculate pricing
        BigDecimal pricePerDay = property.getPricePerDay();
        BigDecimal subtotal = pricePerDay.multiply(BigDecimal.valueOf(stayDuration));

        // Calculate fees
        BigDecimal cleaningFee = calculateCleaningFee(property, stayDuration);
        BigDecimal serviceFee = subtotal.multiply(SERVICE_FEE_PERCENTAGE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal taxAmount = subtotal.multiply(TAX_PERCENTAGE).setScale(2, RoundingMode.HALF_UP);

        // Calculate total price
        BigDecimal totalPrice = subtotal.add(cleaningFee).add(serviceFee).add(taxAmount);

        // Create reservation
        Reservation reservation = Reservation.builder()
                .property(property)
                .user(user)
                .checkInDate(createDto.getCheckInDate())
                .checkOutDate(createDto.getCheckOutDate())
                .numberOfDays(stayDuration)
                .pricePerDay(pricePerDay)
                .totalPrice(totalPrice)
                .cleaningFee(cleaningFee)
                .serviceFee(serviceFee)
                .taxAmount(taxAmount)
                .status("PENDING") // Initial status
                .specialRequests(createDto.getSpecialRequests())
                .guestCount(createDto.getGuestCount())
                .isPaid(false) // Initially not paid
                .paymentMethod(createDto.getPaymentMethod())
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

    private BigDecimal calculateCleaningFee(Property property, int stayDuration) {
        // Base fee plus additional based on property size and stay duration
        BigDecimal sizeFactor = BigDecimal.ONE;
        if (property.getBedrooms() != null) {
            sizeFactor = sizeFactor.add(new BigDecimal("0.25").multiply(BigDecimal.valueOf(property.getBedrooms())));
        }

        // Longer stays may require more cleaning
        BigDecimal durationFactor = BigDecimal.ONE;
        if (stayDuration > 7) {
            durationFactor = new BigDecimal("1.5"); // 50% more for longer stays
        }

        return CLEANING_FEE_BASE.multiply(sizeFactor).multiply(durationFactor).setScale(2, RoundingMode.HALF_UP);
    }

    private void validateReservationDates(LocalDate checkInDate, LocalDate checkOutDate) {
        if (checkInDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Check-in date cannot be in the past");
        }

        if (checkOutDate.isBefore(checkInDate) || checkOutDate.equals(checkInDate)) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }
    }

    private void validateStayDuration(Property property, int stayDuration) {
        if (property.getMinStayDays() != null && stayDuration < property.getMinStayDays()) {
            throw new IllegalArgumentException("Minimum stay duration for this property is " +
                    property.getMinStayDays() + " days");
        }

        if (property.getMaxStayDays() != null && stayDuration > property.getMaxStayDays()) {
            throw new IllegalArgumentException("Maximum stay duration for this property is " +
                    property.getMaxStayDays() + " days");
        }
    }

    private void validateGuestCount(Property property, Integer guestCount) {
        if (property.getMaxGuests() != null && guestCount > property.getMaxGuests()) {
            throw new IllegalArgumentException("Maximum number of guests for this property is " +
                    property.getMaxGuests());
        }
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

    @Transactional(readOnly = true)
    public Page<ReservationDto> getPastReservations(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return reservationRepository.findPastReservationsByUser(user.getId(), pageable)
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

        // If cancelling, record the cancellation time and reason
        if ("CANCELLED".equals(status)) {
            reservation.setCancellationReason("Cancelled by " + (isReservationOwner ? "guest" : "host"));
        }

        // If confirming, record payment if provided
        if ("CONFIRMED".equals(status) && !Boolean.TRUE.equals(reservation.getIsPaid())) {
            reservation.setIsPaid(true);
            reservation.setPaymentDate(LocalDateTime.now());
        }

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
        if (checkInDate.isAfter(checkOutDate) || checkInDate.equals(checkOutDate)) {
            throw new IllegalArgumentException("Check-in date must be before check-out date");
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

        // Check stay duration against property requirements
        int stayDuration = (int) ChronoUnit.DAYS.between(checkInDate, checkOutDate);

        if (property.getMinStayDays() != null && stayDuration < property.getMinStayDays()) {
            return false;
        }

        if (property.getMaxStayDays() != null && stayDuration > property.getMaxStayDays()) {
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

        // Check if cancellation is allowed (e.g., not too close to check-in date)
        LocalDate today = LocalDate.now();
        long daysUntilCheckIn = ChronoUnit.DAYS.between(today, reservation.getCheckInDate());

        // For guest cancellations, apply cancellation policy (e.g., must be more than 2 days in advance)
        if (isReservationOwner && !isAdmin && daysUntilCheckIn < 2) {
            throw new IllegalStateException("Cancellations must be made at least 2 days before check-in");
        }

        // Set status to cancelled
        reservation.setStatus("CANCELLED");
        reservation.setCancellationReason(isReservationOwner ? "Cancelled by guest" : "Cancelled by host");
        reservationRepository.save(reservation);

        // Send cancellation email
        try {
            sendReservationCancellationEmail(reservation);
        } catch (Exception e) {
            // Log error but don't fail the cancellation
            System.err.println("Failed to send reservation cancellation email: " + e.getMessage());
        }
    }

    @Transactional
    public ReservationDto recordPayment(Long reservationId, String paymentMethod, String paymentReference, String username) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        // Security check - only allow payment by the reservation owner or admin
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean isAdmin = user.getRoles().contains("ROLE_ADMIN");
        boolean isReservationOwner = reservation.getUser().getId().equals(user.getId());

        if (!isAdmin && !isReservationOwner) {
            throw new AccessDeniedException("You don't have permission to record payment for this reservation");
        }

        // Only allow payment if reservation is in pending or confirmed status
        if (!("PENDING".equals(reservation.getStatus()) || "CONFIRMED".equals(reservation.getStatus()))) {
            throw new IllegalStateException("Payment can only be recorded for pending or confirmed reservations");
        }

        // Record payment details
        reservation.setIsPaid(true);
        reservation.setPaymentDate(LocalDateTime.now());
        reservation.setPaymentMethod(paymentMethod);
        reservation.setPaymentReference(paymentReference);

        // If reservation was pending, update to confirmed
        if ("PENDING".equals(reservation.getStatus())) {
            reservation.setStatus("CONFIRMED");
        }

        Reservation updatedReservation = reservationRepository.save(reservation);

        // Send payment confirmation email
        try {
            sendPaymentConfirmationEmail(updatedReservation);
        } catch (Exception e) {
            // Log error but don't fail the payment recording
            System.err.println("Failed to send payment confirmation email: " + e.getMessage());
        }

        return reservationMapper.toDto(updatedReservation);
    }

    // Get reservations for a month (for calendar view)
    @Transactional(readOnly = true)
    public List<Reservation> getMonthlyReservations(Long propertyId, int year, int month, String username) {
        // Verify property exists
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        // Security check - only allow viewing by the property owner or admin
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean isAdmin = user.getRoles().contains("ROLE_ADMIN");
        boolean isPropertyOwner = property.getOwner().getId().equals(user.getId());

        if (!isAdmin && !isPropertyOwner) {
            throw new AccessDeniedException("You don't have permission to view this property's reservations");
        }

        return reservationRepository.findReservationsByPropertyAndMonth(propertyId, year, month);
    }

    private void sendReservationConfirmationEmail(Reservation reservation) {
        String subject = "Reservation Confirmation - Property Rental System";
        String body = "<h3>Hi " + reservation.getUser().getFirstName() + ",</h3>" +
                "<p>Your reservation has been confirmed with the following details:</p>" +
                "<p><b>Property:</b> " + reservation.getProperty().getTitle() + "</p>" +
                "<p><b>Check-in Date:</b> " + reservation.getCheckInDate() +
                " at " + (reservation.getProperty().getCheckInTime() != null ?
                reservation.getProperty().getCheckInTime() : "3:00 PM") + "</p>" +
                "<p><b>Check-out Date:</b> " + reservation.getCheckOutDate() +
                " at " + (reservation.getProperty().getCheckOutTime() != null ?
                reservation.getProperty().getCheckOutTime() : "11:00 AM") + "</p>" +
                "<p><b>Number of Days:</b> " + reservation.getNumberOfDays() + "</p>" +
                "<p><b>Number of Guests:</b> " + reservation.getGuestCount() + "</p>" +
                "<p><b>Price Breakdown:</b></p>" +
                "<ul>" +
                "<li>Daily Rate: $" + reservation.getPricePerDay() + " x " + reservation.getNumberOfDays() +
                " days = $" + reservation.getPricePerDay().multiply(BigDecimal.valueOf(reservation.getNumberOfDays())) + "</li>" +
                (reservation.getCleaningFee() != null ? "<li>Cleaning Fee: $" + reservation.getCleaningFee() + "</li>" : "") +
                (reservation.getServiceFee() != null ? "<li>Service Fee: $" + reservation.getServiceFee() + "</li>" : "") +
                (reservation.getTaxAmount() != null ? "<li>Taxes: $" + reservation.getTaxAmount() + "</li>" : "") +
                "<li><strong>Total: $" + reservation.getTotalPrice() + "</strong></li>" +
                "</ul>" +
                "<p><b>Status:</b> " + reservation.getStatus() + "</p>" +
                "<p><b>Payment Required:</b> " + (Boolean.TRUE.equals(reservation.getIsPaid()) ? "Paid" : "Payment Due") + "</p>" +
                "<br><p>Thanks,<br>Property Rental Management Team</p>";

        emailService.sendEmail(reservation.getUser().getEmail(), subject, body);
    }

    private void sendReservationStatusUpdateEmail(Reservation reservation) {
        String subject = "Reservation Status Update - Property Rental System";
        String body = "<h3>Hi " + reservation.getUser().getFirstName() + ",</h3>" +
                "<p>Your reservation status has been updated to: <b>" + reservation.getStatus() + "</b></p>" +
                "<p><b>Property:</b> " + reservation.getProperty().getTitle() + "</p>" +
                "<p><b>Check-in Date:</b> " + reservation.getCheckInDate() + "</p>" +
                "<p><b>Check-out Date:</b> " + reservation.getCheckOutDate() + "</p>" +
                "<br><p>Thanks,<br>Property Rental Management Team</p>";

        emailService.sendEmail(reservation.getUser().getEmail(), subject, body);
    }

    private void sendReservationCancellationEmail(Reservation reservation) {
        String subject = "Reservation Cancellation - Property Rental System";
        String body = "<h3>Hi " + reservation.getUser().getFirstName() + ",</h3>" +
                "<p>Your reservation has been cancelled:</p>" +
                "<p><b>Property:</b> " + reservation.getProperty().getTitle() + "</p>" +
                "<p><b>Check-in Date:</b> " + reservation.getCheckInDate() + "</p>" +
                "<p><b>Check-out Date:</b> " + reservation.getCheckOutDate() + "</p>" +
                "<p><b>Reason:</b> " + (reservation.getCancellationReason() != null ?
                reservation.getCancellationReason() : "Not specified") + "</p>" +
                "<br><p>Thanks,<br>Property Rental Management Team</p>";

        emailService.sendEmail(reservation.getUser().getEmail(), subject, body);
    }

    private void sendPaymentConfirmationEmail(Reservation reservation) {
        String subject = "Payment Confirmation - Property Rental System";
        String body = "<h3>Hi " + reservation.getUser().getFirstName() + ",</h3>" +
                "<p>We've received your payment for the following reservation:</p>" +
                "<p><b>Property:</b> " + reservation.getProperty().getTitle() + "</p>" +
                "<p><b>Check-in Date:</b> " + reservation.getCheckInDate() + "</p>" +
                "<p><b>Check-out Date:</b> " + reservation.getCheckOutDate() + "</p>" +
                "<p><b>Payment Amount:</b> $" + reservation.getTotalPrice() + "</p>" +
                "<p><b>Payment Method:</b> " + reservation.getPaymentMethod() + "</p>" +
                "<p><b>Payment Date:</b> " + reservation.getPaymentDate() + "</p>" +
                "<p><b>Reference:</b> " + reservation.getPaymentReference() + "</p>" +
                "<p>Your reservation is now confirmed. Thank you for your booking!</p>" +
                "<br><p>Thanks,<br>Property Rental Management Team</p>";

        emailService.sendEmail(reservation.getUser().getEmail(), subject, body);
    }
}