package com.travelplatform.travelservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/travels")
@Tag(name = "Travel", description = "Travel management APIs")
public class TravelController {

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the service is healthy")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Travel Service is healthy!");
    }
} 