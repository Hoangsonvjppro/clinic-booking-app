package com.clinic.auth.web.dto;

import com.clinic.auth.model.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for user information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String email;
    private String name;
    private String phone;
    private String role;
    private AccountStatus accountStatus;
    private boolean enabled;
    private boolean emailVerified;
    private Instant createdAt;
    private Instant lastLoginAt;
}
