package com.travelplatform.userservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "permissions", indexes = {
    @Index(name = "idx_name_tenant", columnList = "name, tenant_id"),
    @Index(name = "idx_tenant_id", columnList = "tenant_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 255)
    @Column(name = "description")
    private String description;

    @Column(name = "resource", nullable = false)
    private String resource;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    // Predefined permission names
    public static final String USER_READ = "USER_READ";
    public static final String USER_CREATE = "USER_CREATE";
    public static final String USER_UPDATE = "USER_UPDATE";
    public static final String USER_DELETE = "USER_DELETE";
    
    public static final String TRAVEL_READ = "TRAVEL_READ";
    public static final String TRAVEL_CREATE = "TRAVEL_CREATE";
    public static final String TRAVEL_UPDATE = "TRAVEL_UPDATE";
    public static final String TRAVEL_DELETE = "TRAVEL_DELETE";
    
    public static final String BOOKING_READ = "BOOKING_READ";
    public static final String BOOKING_CREATE = "BOOKING_CREATE";
    public static final String BOOKING_UPDATE = "BOOKING_UPDATE";
    public static final String BOOKING_DELETE = "BOOKING_DELETE";
    
    public static final String PAYMENT_READ = "PAYMENT_READ";
    public static final String PAYMENT_CREATE = "PAYMENT_CREATE";
    public static final String PAYMENT_UPDATE = "PAYMENT_UPDATE";
    public static final String PAYMENT_DELETE = "PAYMENT_DELETE";
    
    public static final String ANALYTICS_READ = "ANALYTICS_READ";
    public static final String ANALYTICS_CREATE = "ANALYTICS_CREATE";
    public static final String ANALYTICS_UPDATE = "ANALYTICS_UPDATE";
    public static final String ANALYTICS_DELETE = "ANALYTICS_DELETE";

    public String getFullPermissionName() {
        return resource + ":" + action;
    }
} 