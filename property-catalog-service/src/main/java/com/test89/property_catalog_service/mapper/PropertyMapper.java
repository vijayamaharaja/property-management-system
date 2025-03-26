package com.test89.property_catalog_service.mapper;

import com.test89.property_catalog_service.dto.AddressDto;
import com.test89.property_catalog_service.dto.PropertyDto;
import com.test89.property_catalog_service.dto.UserSummaryDto;
import com.test89.property_catalog_service.entity.Address;
import com.test89.property_catalog_service.entity.Property;
import com.test89.property_catalog_service.entity.User;
import org.springframework.stereotype.Component;

@Component
public class PropertyMapper {

    public PropertyDto toDto(Property property) {
        if (property == null) {
            return null;
        }

        UserSummaryDto ownerDto = null;
        if (property.getOwner() != null) {
            User owner = property.getOwner();
            ownerDto = UserSummaryDto.builder()
                    .id(owner.getId())
                    .username(owner.getUsername())
                    .firstName(owner.getFirstName())
                    .lastName(owner.getLastName())
                    .build();
        }

        AddressDto addressDto = null;
        if (property.getAddress() != null) {
            Address address = property.getAddress();
            addressDto = AddressDto.builder()
                    .street(address.getStreet())
                    .city(address.getCity())
                    .state(address.getState())
                    .postalCode(address.getPostalCode())
                    .country(address.getCountry())
                    .latitude(address.getLatitude())
                    .longitude(address.getLongitude())
                    .build();
        }

        return PropertyDto.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .type(property.getType())
                .pricePerDay(property.getPricePerDay())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .area(property.getArea())
                .maxGuests(property.getMaxGuests())
                .minStayDays(property.getMinStayDays())
                .maxStayDays(property.getMaxStayDays())
                .address(addressDto)
                .amenities(property.getAmenities())
                .imageUrls(property.getImageUrls())
                .status(property.getStatus())
                .petsAllowed(property.getPetsAllowed())
                .smokingAllowed(property.getSmokingAllowed())
                .partiesAllowed(property.getPartiesAllowed())
                .checkInTime(property.getCheckInTime())
                .checkOutTime(property.getCheckOutTime())
                .createdAt(property.getCreatedAt())
                .updatedAt(property.getUpdatedAt())
                .owner(ownerDto)
                .build();
    }

    public Property toEntity(PropertyDto dto, User owner) {
        if (dto == null) {
            return null;
        }

        Address address = null;
        if (dto.getAddress() != null) {
            AddressDto addressDto = dto.getAddress();
            address = Address.builder()
                    .street(addressDto.getStreet())
                    .city(addressDto.getCity())
                    .state(addressDto.getState())
                    .postalCode(addressDto.getPostalCode())
                    .country(addressDto.getCountry())
                    .latitude(addressDto.getLatitude())
                    .longitude(addressDto.getLongitude())
                    .build();
        }

        return Property.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .type(dto.getType())
                .pricePerDay(dto.getPricePerDay())
                .bedrooms(dto.getBedrooms())
                .bathrooms(dto.getBathrooms())
                .area(dto.getArea())
                .maxGuests(dto.getMaxGuests())
                .minStayDays(dto.getMinStayDays())
                .maxStayDays(dto.getMaxStayDays())
                .address(address)
                .amenities(dto.getAmenities())
                .imageUrls(dto.getImageUrls())
                .status(dto.getStatus())
                .petsAllowed(dto.getPetsAllowed())
                .smokingAllowed(dto.getSmokingAllowed())
                .partiesAllowed(dto.getPartiesAllowed())
                .checkInTime(dto.getCheckInTime())
                .checkOutTime(dto.getCheckOutTime())
                .owner(owner)
                .build();
    }

    public void updateEntityFromDto(PropertyDto dto, Property property) {
        if (dto == null || property == null) {
            return;
        }

        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setType(dto.getType());
        property.setPricePerDay(dto.getPricePerDay());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setArea(dto.getArea());
        property.setMaxGuests(dto.getMaxGuests());
        property.setMinStayDays(dto.getMinStayDays());
        property.setMaxStayDays(dto.getMaxStayDays());
        property.setStatus(dto.getStatus());
        property.setPetsAllowed(dto.getPetsAllowed());
        property.setSmokingAllowed(dto.getSmokingAllowed());
        property.setPartiesAllowed(dto.getPartiesAllowed());
        property.setCheckInTime(dto.getCheckInTime());
        property.setCheckOutTime(dto.getCheckOutTime());

        if (dto.getAmenities() != null) {
            property.setAmenities(dto.getAmenities());
        }

        if (dto.getImageUrls() != null) {
            property.setImageUrls(dto.getImageUrls());
        }

        if (dto.getAddress() != null) {
            Address address = property.getAddress() != null ? property.getAddress() : new Address();
            AddressDto addressDto = dto.getAddress();

            address.setStreet(addressDto.getStreet());
            address.setCity(addressDto.getCity());
            address.setState(addressDto.getState());
            address.setPostalCode(addressDto.getPostalCode());
            address.setCountry(addressDto.getCountry());
            address.setLatitude(addressDto.getLatitude());
            address.setLongitude(addressDto.getLongitude());

            property.setAddress(address);
        }
    }
}