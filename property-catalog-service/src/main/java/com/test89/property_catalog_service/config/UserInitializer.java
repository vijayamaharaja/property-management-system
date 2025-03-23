package com.test89.property_catalog_service.config;

import com.test89.property_catalog_service.entity.User;
import com.test89.property_catalog_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class UserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.initialize-default-users:true}")
    private boolean initializeDefaultUsers;

    @Override
    public void run(String... args) {
        if (!initializeDefaultUsers) {
            return; // Skip user initialization if disabled from application properties
        }

        // Hardcoding a couple of users to the system with default username and password just for demo purposes
        // Initialize admin user
        initializeUser(
                "admin",
                "admin@test89.com",
                "adminPass",
                "Admin",
                "User",
                "1234567890",
                Set.of("ROLE_ADMIN")
        );

        // Initialize regular user
        initializeUser(
                "user",
                "user@test89.com",
                "userPass",
                "Regular",
                "User",
                "9876543210",
                Set.of("ROLE_USER")
        );
    }

    private void initializeUser(String username, String email, String password,
                                String firstName, String lastName,
                                String phoneNumber, Set<String> roles) {

        Optional<User> existingUser = userRepository.findByUsername(username);

        if (existingUser.isEmpty()) {
            User newUser = User.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .firstName(firstName)
                    .lastName(lastName)
                    .phoneNumber(phoneNumber)
                    .roles(new HashSet<>(roles))
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            userRepository.save(newUser);
            System.out.println(username + " user created successfully");
        }
    }
}