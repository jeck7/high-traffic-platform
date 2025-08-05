package com.travelplatform.userservice.controller;

import com.travelplatform.userservice.dto.AuthResponseDto;
import com.travelplatform.userservice.dto.LoginDto;
import com.travelplatform.userservice.dto.UserRegistrationDto;
import com.travelplatform.userservice.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Register a new user with the system")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody UserRegistrationDto registrationDto,
                                                  HttpServletRequest request) {
        String tenantId = extractTenantId(request);
        registrationDto.setTenantId(tenantId);
        
        AuthResponseDto response = authService.register(registrationDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT tokens")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto loginDto,
                                               HttpServletRequest request) {
        String tenantId = extractTenantId(request);
        loginDto.setTenantId(tenantId);
        
        AuthResponseDto response = authService.login(loginDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Refresh access token using refresh token")
    public ResponseEntity<AuthResponseDto> refreshToken(@RequestParam String refreshToken) {
        AuthResponseDto response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout user and invalidate tokens")
    public ResponseEntity<Void> logout(@RequestParam String refreshToken) {
        authService.logout(refreshToken);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify email", description = "Verify user email with token")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Send password reset email")
    public ResponseEntity<Void> forgotPassword(@RequestParam String email,
                                             HttpServletRequest request) {
        String tenantId = extractTenantId(request);
        authService.forgotPassword(email, tenantId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset password with token")
    public ResponseEntity<Void> resetPassword(@RequestParam String token,
                                            @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the service is healthy")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("User Service is healthy!");
    }



    private String extractTenantId(HttpServletRequest request) {
        String tenantId = request.getHeader("X-Tenant-ID");
        if (tenantId == null) {
            // Extract from subdomain if available
            String host = request.getHeader("Host");
            if (host != null && host.contains(".")) {
                tenantId = host.split("\\.")[0];
            }
        }
        return tenantId != null ? tenantId : "default";
    }
} 