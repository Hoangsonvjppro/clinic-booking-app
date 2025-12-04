package com.clinic.auth.web;

import com.clinic.auth.service.UserAccountService;
import com.clinic.auth.web.dto.UpdateUserStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Internal API controller for service-to-service communication.
 * Used by notification-service to update user account status.
 * Used by doctor-service to update user roles.
 */
@RestController
@RequestMapping("/api/v1/internal/users")
@RequiredArgsConstructor
public class InternalUserController {

    private final UserAccountService userAccountService;

    /**
     * Updates user account status.
     * Called by notification-service when applying penalties or resolving reports.
     *
     * @param userId the user ID
     * @param request the status update request
     * @return success response
     */
    @PatchMapping("/{userId}/status")
    public ResponseEntity<Void> updateUserStatus(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        userAccountService.updateUserStatus(userId, request);
        return ResponseEntity.ok().build();
    }

    /**
     * Suspends a user account until specified date.
     *
     * @param userId the user ID
     * @param suspendUntil the suspension end date
     * @param reason the suspension reason
     * @return success response
     */
    @PostMapping("/{userId}/suspend")
    public ResponseEntity<Void> suspendUser(
            @PathVariable UUID userId,
            @RequestParam String suspendUntil,
            @RequestParam(required = false) String reason) {
        UpdateUserStatusRequest request = new UpdateUserStatusRequest();
        request.setEnabled(false);
        request.setReason("Account suspended until " + suspendUntil + 
                (reason != null ? ": " + reason : ""));
        userAccountService.updateUserStatus(userId, request);
        return ResponseEntity.ok().build();
    }

    /**
     * Bans a user account permanently.
     *
     * @param userId the user ID
     * @param reason the ban reason
     * @return success response
     */
    @PostMapping("/{userId}/ban")
    public ResponseEntity<Void> banUser(
            @PathVariable UUID userId,
            @RequestParam(required = false) String reason) {
        UpdateUserStatusRequest request = new UpdateUserStatusRequest();
        request.setEnabled(false);
        request.setReason("Account permanently banned" + 
                (reason != null ? ": " + reason : ""));
        userAccountService.updateUserStatus(userId, request);
        return ResponseEntity.ok().build();
    }

    /**
     * Reactivates a suspended/banned user account.
     *
     * @param userId the user ID
     * @param reason the reactivation reason
     * @return success response
     */
    @PostMapping("/{userId}/reactivate")
    public ResponseEntity<Void> reactivateUser(
            @PathVariable UUID userId,
            @RequestParam(required = false) String reason) {
        UpdateUserStatusRequest request = new UpdateUserStatusRequest();
        request.setEnabled(true);
        request.setReason("Account reactivated" + 
                (reason != null ? ": " + reason : ""));
        userAccountService.updateUserStatus(userId, request);
        return ResponseEntity.ok().build();
    }

    /**
     * Updates user role.
     * Called by doctor-service when approving doctor applications.
     *
     * @param userId the user ID
     * @param role the new role to assign (e.g., "DOCTOR")
     * @return success response
     */
    @PutMapping("/{userId}/role")
    public ResponseEntity<Void> updateUserRole(
            @PathVariable UUID userId,
            @RequestParam String role) {
        userAccountService.updateUserRole(userId, role);
        return ResponseEntity.ok().build();
    }
}
