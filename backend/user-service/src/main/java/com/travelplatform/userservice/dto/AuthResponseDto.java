package com.travelplatform.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserDto user;
    private String tenantId;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String fullName;
        private String phoneNumber;
        private String profilePictureUrl;
        private Boolean isEmailVerified;
        private String preferredLanguage;
        private String timezone;
        private LocalDateTime lastLoginAt;
        private Set<String> roles;
        private LocalDateTime createdAt;
    }
} 