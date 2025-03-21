package com.test89.property_catalog_service.service;

import com.test89.property_catalog_service.dto.UserDto;
import com.test89.property_catalog_service.dto.UserRegistrationDto;
import com.test89.property_catalog_service.entity.User;
import com.test89.property_catalog_service.exception.ResourceNotFoundException;
import com.test89.property_catalog_service.exception.UserAlreadyExistsException;
import com.test89.property_catalog_service.mapper.UserMapper;
import com.test89.property_catalog_service.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Transactional
    public UserDto registerUser(UserRegistrationDto registrationDto) {
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists: " + registrationDto.getUsername());
        }

        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists: " + registrationDto.getEmail());
        }

        User user = userMapper.fromRegistrationDto(registrationDto);
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
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
}