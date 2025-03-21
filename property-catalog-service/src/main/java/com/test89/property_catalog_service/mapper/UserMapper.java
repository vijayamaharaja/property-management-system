package com.test89.property_catalog_service.mapper;

import com.test89.property_catalog_service.dto.UserDto;
import com.test89.property_catalog_service.dto.UserRegistrationDto;
import com.test89.property_catalog_service.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    private final PasswordEncoder passwordEncoder;

    public UserMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .roles(user.getRoles())
                .enabled(user.isEnabled())
                .build();
    }

    public User fromRegistrationDto(UserRegistrationDto dto) {
        if (dto == null) {
            return null;
        }

        HashSet<String> roles = new HashSet<>();
        roles.add("ROLE_USER");

        return User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .phoneNumber(dto.getPhoneNumber())
                .roles(roles)
                .enabled(true)
                .build();
    }
}
