package com.test89.property_catalog_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class PropertyCatalogServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
