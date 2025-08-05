package com.travelplatform.gateway.config;

import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationConverter {

    public boolean validateToken(String token) {
        // TODO: Implement JWT validation
        return true;
    }

    public Object getClaimsFromToken(String token) {
        // TODO: Implement JWT claims extraction
        return null;
    }

    public java.util.Collection<org.springframework.security.core.GrantedAuthority> extractAuthorities(Object claims) {
        // TODO: Implement authorities extraction
        return new java.util.ArrayList<>();
    }
} 