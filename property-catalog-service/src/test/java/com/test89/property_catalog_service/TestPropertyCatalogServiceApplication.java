package com.test89.property_catalog_service;

import org.springframework.boot.SpringApplication;

public class TestPropertyCatalogServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(PropertyCatalogServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
