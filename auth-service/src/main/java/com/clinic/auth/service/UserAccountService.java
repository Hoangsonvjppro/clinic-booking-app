package com.clinic.auth.service;

import com.clinic.auth.client.PatientRegistryClient;
import com.clinic.auth.client.dto.PatientStatusUpdateRequest;
import com.clinic.auth.exception.ResourceNotFoundException;
import com.clinic.auth.model.Role;
import com.clinic.auth.model.User;
import com.clinic.auth.model.enums.AccountStatus;
import com.clinic.auth.repo.RoleRepository;
import com.clinic.auth.repo.UserRepository;
import com.clinic.auth.web.dto.UpdateUserStatusRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserAccountService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PatientRegistryClient patientRegistryClient;
    private final AuditService auditService;

    @Transactional
    public void updateUserStatus(java.util.UUID userId, UpdateUserStatusRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        boolean changed = false;
        StringBuilder auditMessage = new StringBuilder("User status update: ");

        // Handle enabled/disabled status
        if (request.getEnabled() != null) {
            boolean current = user.isEnabled();
            boolean target = request.getEnabled();
            if (current != target) {
                user.setEnabled(target);
                auditMessage.append("enabled=").append(target).append(" ");
                changed = true;
            }
        }

        // Handle account status
        if (request.getAccountStatus() != null) {
            AccountStatus currentStatus = user.getAccountStatus();
            AccountStatus targetStatus = request.getAccountStatus();
            if (currentStatus != targetStatus) {
                user.setAccountStatus(targetStatus);
                auditMessage.append("accountStatus=").append(targetStatus).append(" ");
                changed = true;
                
                // Auto-disable if banned/suspended
                if (targetStatus == AccountStatus.BANNED || targetStatus == AccountStatus.SUSPENDED) {
                    if (user.isEnabled()) {
                        user.setEnabled(false);
                        auditMessage.append("enabled=false (auto) ");
                    }
                }
            }
        }

        if (!changed) {
            auditService.logEvent(
                    "USER_STATUS_UNCHANGED",
                    "USER",
                    user.getEmail(),
                    "No status change"
            );
            return;
        }

        userRepository.save(user);

        auditService.logEvent(
                "USER_STATUS_UPDATED",
                "USER",
                user.getEmail(),
                auditMessage.toString() + buildReasonSuffix(request.getReason())
        );

        syncPatientStatus(user, user.isEnabled());
        
        log.info("User status updated: userId={}, accountStatus={}, enabled={}", 
                userId, user.getAccountStatus(), user.isEnabled());
    }

    private void syncPatientStatus(User user, boolean enabled) {
        // Tạm thời map đơn giản: enabled -> ACTIVE, disabled -> SUSPENDED
        String patientStatus = enabled ? "ACTIVE" : "SUSPENDED";
        PatientStatusUpdateRequest payload = new PatientStatusUpdateRequest(
                user.getEmail(),
                enabled,
                patientStatus
        );

        try {
            patientRegistryClient.updatePatientStatus(payload);
        } catch (Exception e) {
            log.warn("Failed to sync patient status: {}", e.getMessage());
        }
    }

    private String buildReasonSuffix(String reason) {
        if (reason == null || reason.isBlank()) {
            return "";
        }
        return " (reason: " + reason.trim() + ")";
    }

    /**
     * Updates user role - used for internal service-to-service calls.
     * Called by doctor-service when approving doctor applications.
     *
     * @param userId the user ID
     * @param roleName the role to assign (e.g., "DOCTOR")
     */
    @Transactional
    public void updateUserRole(java.util.UUID userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));
        
        user.setRoles(Set.of(role));
        userRepository.save(user);
        
        auditService.logEvent(
                "USER_ROLE_UPDATED",
                "USER",
                user.getEmail(),
                "Role updated to: " + roleName
        );
        
        log.info("User role updated: userId={}, role={}", userId, roleName);
    }
}

