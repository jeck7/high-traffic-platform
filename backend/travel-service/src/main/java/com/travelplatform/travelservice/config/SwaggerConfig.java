package com.travelplatform.travelservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI travelServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Travel Service API")
                        .description("Travel booking and management service for Travel Platform")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Travel Platform Team")
                                .email("support@travelplatform.com")
                                .url("https://travelplatform.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8082").description("Local Development Server"),
                        new Server().url("http://travel_travel_service:8082").description("Docker Development Server")
                ));
    }
} 