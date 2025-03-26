package com.test89.property_catalog_service.mapper;

import com.test89.property_catalog_service.dto.AddressDto;
import com.test89.property_catalog_service.dto.PropertySummaryDto;
import com.test89.property_catalog_service.dto.ReservationDto;
import com.test89.property_catalog_service.dto.UserSummaryDto;
import com.test89.property_catalog_service.entity.Property;
import com.test89.property_catalog_service.entity.Reservation;
import com.test89.property_catalog_service.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReservationMapper {

    public ReservationDto toDto(Reservation reservation) {
        if (reservation == null) {
            return null;
        }

        // Map property to PropertySummaryDto
        PropertySummaryDto propertySummaryDto = null;
        if (reservation.getProperty() != null) {
            Property property = reservation.getProperty();

            // Get the first image URL if available
            String imageUrl = null;
            if (property.getImageUrls() != null && !property.getImageUrls().isEmpty()) {
                imageUrl = property.getImageUrls().iterator().next();
            }

            AddressDto addressDto = null;
            if (property.getAddress() != null) {
                addressDto = AddressDto.builder()
                        .street(property.getAddress().getStreet())
                        .city(property.getAddress().getCity())
                        .state(property.getAddress().getState())
                        .postalCode(property.getAddress().getPostalCode())
                        .country(property.getAddress().getCountry())
                        .build();
            }

            propertySummaryDto = PropertySummaryDto.builder()
                    .id(property.getId())
                    .title(property.getTitle())
                    .type(property.getType())
                    .pricePerDay(property.getPricePerDay())
                    .maxGuests(property.getMaxGuests())
                    .address(addressDto)
                    .imageUrl(imageUrl)
                    .build();
        }

        // Map user to UserSummaryDto
        UserSummaryDto userSummaryDto = null;
        if (reservation.getUser() != null) {
            User user = reservation.getUser();
            userSummaryDto = UserSummaryDto.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .build();
        }

        return ReservationDto.builder()
                .id(reservation.getId())
                .property(propertySummaryDto)
                .user(userSummaryDto)
                .checkInDate(reservation.getCheckInDate())
                .checkOutDate(reservation.getCheckOutDate())
                .numberOfDays(reservation.getNumberOfDays())
                .pricePerDay(reservation.getPricePerDay())
                .totalPrice(reservation.getTotalPrice())
                .cleaningFee(reservation.getCleaningFee())
                .serviceFee(reservation.getServiceFee())
                .taxAmount(reservation.getTaxAmount())
                .guestCount(reservation.getGuestCount())
                .status(reservation.getStatus())
                .specialRequests(reservation.getSpecialRequests())
                .cancellationReason(reservation.getCancellationReason())
                .isPaid(reservation.getIsPaid())
                .paymentDate(reservation.getPaymentDate())
                .paymentMethod(reservation.getPaymentMethod())
                .paymentReference(reservation.getPaymentReference())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .build();
    }

    public List<ReservationDto> toDtoList(List<Reservation> reservations) {
        return reservations.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}