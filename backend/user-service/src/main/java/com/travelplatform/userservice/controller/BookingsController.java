package com.travelplatform.userservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Bookings", description = "Bookings management APIs")
public class BookingsController {

    @GetMapping("/bookings")
    @Operation(summary = "Get user bookings", description = "Get all bookings for the authenticated user")
    public ResponseEntity<Map<String, Object>> getBookings(HttpServletRequest request) {
        // Mock bookings data for development
        List<Map<String, Object>> mockBookings = List.of(
            Map.of(
                "id", "1",
                "travelPackageId", "1",
                "travelPackageTitle", "Sunny Beach Paradise",
                "travelPackageImage", "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
                "destination", "Bali, Indonesia",
                "bookingDate", "2024-09-15",
                "travelersCount", 2,
                "totalPrice", 2599.98,
                "status", "CONFIRMED",
                "createdAt", "2024-08-01T10:30:00Z"
            ),
            Map.of(
                "id", "2",
                "travelPackageId", "3",
                "travelPackageTitle", "City Break in Paris",
                "travelPackageImage", "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop",
                "destination", "Paris, France",
                "bookingDate", "2024-08-05",
                "travelersCount", 2,
                "totalPrice", 1599.98,
                "status", "CONFIRMED",
                "createdAt", "2024-07-15T14:20:00Z"
            ),
            Map.of(
                "id", "3",
                "travelPackageId", "5",
                "travelPackageTitle", "Island Hopping",
                "travelPackageImage", "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
                "destination", "Greek Islands",
                "bookingDate", "2024-12-01",
                "travelersCount", 2,
                "totalPrice", 3199.98,
                "status", "PENDING",
                "createdAt", "2024-08-02T09:15:00Z"
            )
        );

        Map<String, Object> response = Map.of(
            "bookings", mockBookings,
            "total", mockBookings.size(),
            "message", "Bookings retrieved successfully"
        );

        return ResponseEntity.ok(response);
    }
} 