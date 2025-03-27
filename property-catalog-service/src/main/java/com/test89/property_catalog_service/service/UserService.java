package com.test89.property_catalog_service.service;

import com.test89.property_catalog_service.dto.LoginRequestDto;
import com.test89.property_catalog_service.dto.UserDto;
import com.test89.property_catalog_service.dto.UserRegistrationDto;
import com.test89.property_catalog_service.entity.User;
import com.test89.property_catalog_service.exception.AuthenticationException;
import com.test89.property_catalog_service.exception.ResourceNotFoundException;
import com.test89.property_catalog_service.exception.UserAlreadyExistsException;
import com.test89.property_catalog_service.mapper.UserMapper;
import com.test89.property_catalog_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto registerUser(UserRegistrationDto registrationDto) {
        logger.debug("Starting registration process for: {}", registrationDto.getUsername());
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            logger.warn("Username already exists: {}", registrationDto.getUsername());
            throw new UserAlreadyExistsException("Username already exists: " + registrationDto.getUsername());
        }

        logger.debug("Checking if email exists: {}", registrationDto.getEmail());
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            logger.warn("Email already exists: {}", registrationDto.getEmail());
            throw new UserAlreadyExistsException("Email already exists: " + registrationDto.getEmail());
        }

        try {
            logger.debug("Converting DTO to entity");
            User user = userMapper.fromRegistrationDto(registrationDto);

            logger.debug("Setting default roles if needed");
            if (user.getRoles() == null || user.getRoles().isEmpty()) {
                user.setRoles(Set.of("ROLE_USER"));
            }

            logger.debug("Saving user to database");
            User savedUser = userRepository.save(user);

            logger.debug("Sending welcome email");
            try {
                emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFirstName());
            } catch (Exception e) {
                logger.warn("Failed to send welcome email", e);
                // Continue with registration even if email fails
            }

            logger.debug("Generating JWT token");
            String token = userMapper.generateToken(savedUser);

            logger.debug("Converting saved user to DTO");
            return userMapper.toDto(savedUser, token);
        } catch (Exception e) {
            logger.error("Unexpected error during user registration", e);
            throw e;
        }

    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toDto(user);
    }

    @Transactional(readOnly = true)
    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return userMapper.toDto(user);
    }

    @Transactional
    public UserDto updateUser(Long id, UserDto userDto, String currentUsername) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + currentUsername));

        User userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Check if the current user is updating their own profile or is an admin
        if (!currentUser.getId().equals(id) && !currentUser.getRoles().contains("ROLE_ADMIN")) {
            throw new AccessDeniedException("You don't have permission to update this user");
        }

        // Update user fields but preserve roles unless admin
        userToUpdate.setFirstName(userDto.getFirstName());
        userToUpdate.setLastName(userDto.getLastName());
        userToUpdate.setPhoneNumber(userDto.getPhoneNumber());

        // Only admins can modify roles and enabled status
        if (currentUser.getRoles().contains("ROLE_ADMIN")) {
            userToUpdate.setRoles(userDto.getRoles());
            userToUpdate.setEnabled(userDto.isEnabled());
        }

        User updatedUser = userRepository.save(userToUpdate);
        return userMapper.toDto(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id, String currentUsername) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + currentUsername));

        // Check if the current user is deleting their own account or is an admin
        if (!currentUser.getId().equals(id) && !currentUser.getRoles().contains("ROLE_ADMIN")) {
            throw new AccessDeniedException("You don't have permission to delete this user");
        }

        userRepository.deleteById(id);
    }

    @Transactional
    public UserDto authenticateUser(LoginRequestDto loginRequest) {
        // Find the user by username
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new AuthenticationException("Invalid username or password"));

        // Verify the password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new AuthenticationException("Invalid username or password");
        }

        // Generate JWT token
        String token = userMapper.generateToken(user);

        // Map user to UserDto with token
        return userMapper.toDto(user, token);
    }

}