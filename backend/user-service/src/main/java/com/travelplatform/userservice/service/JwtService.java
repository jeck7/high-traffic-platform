package com.travelplatform.userservice.service;

import com.travelplatform.userservice.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    public String generateAccessToken(User user) {
        return "dummy-access-token";
    }

    public String generateRefreshToken(User user) {
        return "dummy-refresh-token";
    }

    public String extractUsername(String token) {
        return "dummy-username";
    }

    public Long extractUserId(String token) {
        return 1L;
    }

    public String extractTenantId(String token) {
        return "default";
    }

    public Date extractExpiration(String token) {
        return new Date(System.currentTimeMillis() + 86400000L);
    }

    public boolean isTokenExpired(String token) {
        return false;
    }

    public boolean validateToken(String token) {
        return true;
    }

    public long getExpirationTime() {
        return jwtExpiration != null ? jwtExpiration : 86400000L;
    }
} 