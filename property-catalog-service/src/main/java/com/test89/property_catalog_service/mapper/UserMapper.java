package com.test89.property_catalog_service.mapper;

import com.test89.property_catalog_service.dto.UserDto;
import com.test89.property_catalog_service.dto.UserRegistrationDto;
import com.test89.property_catalog_service.entity.User;
import com.test89.property_catalog_service.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserDto toDto(User user) {
        return toDto(user, null);
    }

    public UserDto toDto(User user, String token) {
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
                .token(token)
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

    /**
     * Create UserDetails for Spring Security authentication
     * @param user The user entity
     * @return UserDetails for authentication
     */
    public UserDetails toUserDetails(User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getRoles().stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList())
        );
    }

    /**
     * Generate JWT token for a user
     * @param user The user entity
     * @return Generated JWT token
     */
    public String generateToken(User user) {
        UserDetails userDetails = toUserDetails(user);
        return jwtTokenProvider.generateToken(userDetails);
    }
}