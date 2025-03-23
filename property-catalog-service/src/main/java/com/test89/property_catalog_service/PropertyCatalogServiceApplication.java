package com.test89.property_catalog_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
public class PropertyCatalogServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PropertyCatalogServiceApplication.class, args);
	}

}
