package com.clinic.auth.web;

import com.clinic.auth.model.User;
import com.clinic.auth.model.enums.AccountStatus;
import com.clinic.auth.repo.UserRepository;
import com.clinic.auth.service.UserAccountService;
import com.clinic.auth.web.dto.UpdateUserStatusRequest;
import com.clinic.auth.web.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Admin controller for user management.
 * Only accessible by users with ADMIN role.
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;
    private final UserAccountService userAccountService;

    /**
     * Gets all users with optional filters.
     */
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) AccountStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<User> users;
        if (role != null && status != null) {
            users = userRepository.findByRoleNameAndAccountStatus(role, status, pageable);
        } else if (role != null) {
            users = userRepository.findByRoleName(role, pageable);
        } else if (status != null) {
            users = userRepository.findByAccountStatus(status, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        
        Page<UserResponse> response = users.map(this::toUserResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * Gets a specific user by ID.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return ResponseEntity.ok(toUserResponse(user));
    }

    /**
     * Updates user account status.
     */
    @PutMapping("/{userId}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        
        log.info("Admin updating user status: userId={}, status={}", userId, request.getAccountStatus());
        
        userAccountService.updateUserStatus(userId, request);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        return ResponseEntity.ok(toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        String roleName = user.getRoles().stream()
                .map(r -> r.getName())
                .findFirst()
                .orElse("UNKNOWN");
        
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getFullName())
                .phone(user.getPhone())
                .role(roleName)
                .accountStatus(user.getAccountStatus())
                .enabled(user.isEnabled())
                .emailVerified(user.getEmailVerifiedAt() != null)
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}
