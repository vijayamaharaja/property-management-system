package com.test89.property_catalog_service.controller;

import com.test89.property_catalog_service.dto.ReservationCreateDto;
import com.test89.property_catalog_service.dto.ReservationDto;
import com.test89.property_catalog_service.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
@Tag(name = "Reservation Management", description = "APIs for managing property reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a new reservation",
            description = "Allows an authenticated user to create a new property reservation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Reservation created successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ReservationDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid reservation details"),
            @ApiResponse(responseCode = "403", description = "Unauthorized access"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    public ResponseEntity<ReservationDto> createReservation(
            @Parameter(description = "Reservation creation details", required = true)
            @RequestBody ReservationCreateDto createDto,
            Authentication authentication) {
        String username = authentication.getName();
        ReservationDto createdReservation = reservationService.createReservation(createDto, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get reservation by ID",
            description = "Retrieve a specific reservation details by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reservation found",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ReservationDto.class))),
            @ApiResponse(responseCode = "403", description = "Unauthorized access"),
            @ApiResponse(responseCode = "404", description = "Reservation not found")
    })
    public ResponseEntity<ReservationDto> getReservationById(
            @Parameter(description = "Reservation ID", example = "123", required = true)
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        ReservationDto reservation = reservationService.getReservationById(id, username);
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/my-reservations")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user's reservations",
            description = "Retrieve paginated list of reservations for the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reservations retrieved successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Unauthorized access")
    })
    public ResponseEntity<Page<ReservationDto>> getUserReservations(
            Authentication authentication,
            @Parameter(description = "Pagination parameters")
            @PageableDefault(size = 20) Pageable pageable) {
        String username = authentication.getName();
        Page<ReservationDto> reservations = reservationService.getUserReservations(username, pageable);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/upcoming")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get upcoming reservations",
            description = "Retrieve paginated list of upcoming reservations for the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Upcoming reservations retrieved successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Unauthorized access")
    })
    public ResponseEntity<Page<ReservationDto>> getUpcomingReservations(
            Authentication authentication,
            @Parameter(description = "Pagination parameters")
            @PageableDefault(size = 20) Pageable pageable) {
        String username = authentication.getName();
        Page<ReservationDto> reservations = reservationService.getUpcomingReservations(username, pageable);
        return ResponseEntity.ok(reservations);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update reservation status",
            description = "Update the status of a specific reservation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reservation status updated successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ReservationDto.class))),
            @ApiResponse(responseCode = "403", description = "Unauthorized access"),
            @ApiResponse(responseCode = "404", description = "Reservation not found")
    })
    public ResponseEntity<ReservationDto> updateReservationStatus(
            @Parameter(description = "Reservation ID", example = "123", required = true)
            @PathVariable Long id,
            @Parameter(description = "New reservation status", example = "CONFIRMED", required = true)
            @RequestParam String status,
            Authentication authentication) {
        String username = authentication.getName();
        ReservationDto updatedReservation = reservationService.updateReservationStatus(id, status, username);
        return ResponseEntity.ok(updatedReservation);
    }

    @GetMapping("/property/{propertyId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get property reservations",
            description = "Retrieve paginated list of reservations for a specific property")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Property reservations retrieved successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Unauthorized access"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    public ResponseEntity<Page<ReservationDto>> getPropertyReservations(
            @Parameter(description = "Property ID", example = "456", required = true)
            @PathVariable Long propertyId,
            Authentication authentication,
            @Parameter(description = "Pagination parameters")
            @PageableDefault(size = 20) Pageable pageable) {
        String username = authentication.getName();
        Page<ReservationDto> reservations = reservationService.getPropertyReservations(propertyId, username, pageable);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/availability")
    @Operation(summary = "Check property availability",
            description = "Check if a property is available for booking during specified dates")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Availability checked successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = Boolean.class))),
            @ApiResponse(responseCode = "400", description = "Invalid date parameters"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    public ResponseEntity<Boolean> checkPropertyAvailability(
            @Parameter(description = "Property ID", example = "456", required = true)
            @RequestParam Long propertyId,
            @Parameter(description = "Check-in date", example = "2024-07-15", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @Parameter(description = "Check-out date", example = "2024-07-20", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {
        boolean isAvailable = reservationService.isPropertyAvailable(propertyId, checkInDate, checkOutDate);
        return ResponseEntity.ok(isAvailable);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel a reservation",
            description = "Cancel a specific reservation by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Reservation cancelled successfully"),
            @ApiResponse(responseCode = "403", description = "Unauthorized access"),
            @ApiResponse(responseCode = "404", description = "Reservation not found")
    })
    public ResponseEntity<Void> cancelReservation(
            @Parameter(description = "Reservation ID", example = "123", required = true)
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        reservationService.cancelReservation(id, username);
        return ResponseEntity.noContent().build();
    }
}