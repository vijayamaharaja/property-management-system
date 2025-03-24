# property-management-system
A sample microservices based architecture for a property management system

## Setting Up Git Hooks

After cloning the repository, run the following script to set up the Git hooks:

./setup-hooks.sh

You may need to apply appropriate permissions to the script chmod +x ./setup-hooks.sh



# Project Structure and Dependencies

- Spring Boot 3.2.3 with Java 17
- Spring Security with OAuth2 for secure authentication
- Spring Data JPA for database operations
- PostgreSQL database
- Lombok for reducing boilerplate code
- Swagger/OpenAPI for API documentation

# Database Schema

## User Entity

- Basic user information (username, email, password, etc.)
- Role-based security model (ROLE_USER, ROLE_ADMIN)


## Property Entity

- Full property details (title, description, price, rooms, etc.)
- Embedded Address class
- Collections for amenities and images
- Relation to the property owner (User)



# Security Implementation

- OAuth2 Authorization Server configured for:

  - Authorization Code flow
  - Refresh Token
  - Client Credentials


- Resource Server setup with JWT validation
- Proper role-based access controls
- Password encryption with BCrypt

# API Endpoints

## Public Endpoints (no authentication required)

- View available properties
- Search properties by various criteria
- Get property details by ID


## Protected Endpoints (authentication required)

- Create, update, delete properties
- User profile management
- View properties by owner


## Admin Endpoints

- Administrative functions for user and property management



# Additional Features

- Comprehensive exception handling with custom error responses
- Validation for request payloads
- Data Transfer Objects (DTOs) to separate API from domain model
- Added sample data for testing

# Getting Started
## To run this application:

- Clone the repository
- Build the project with Maven: `mvn clean install`
- Run the application: `mvn spring-boot:run`
- Access the Swagger UI at: http://localhost:8080/swagger-ui.html

The application will start with sample users and properties for testing. You can use the following credentials:

- Admin: username admin, password password
- Regular users: user1 or user2 with password password