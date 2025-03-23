package com.test89.property_catalog_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@ImportAutoConfiguration(exclude = {
		org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration.class
})
class PropertyCatalogServiceApplicationTests {
	@Test
	void contextLoads() {}
}
