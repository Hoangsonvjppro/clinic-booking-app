package com.clinic.auth.service;

import com.clinic.auth.client.PatientRegistryClient;
import com.clinic.auth.client.dto.PatientStatusUpdateRequest;
import com.clinic.auth.exception.ResourceNotFoundException;
import com.clinic.auth.model.User;
import com.clinic.auth.repo.UserRepository;
import com.clinic.auth.web.dto.UpdateUserStatusRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserAccountService {

    private final UserRepository userRepository;
    private final PatientRegistryClient patientRegistryClient;
    private final AuditService auditService;

    @Transactional
    public void updateUserStatus(Long userId, UpdateUserStatusRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        boolean current = user.isEnabled();
        boolean target = request.getEnabled();
        if (current == target) {
            // Không thay đổi trạng thái -> ghi audit nhẹ và thoát
            auditService.logEvent(
                    "USER_STATUS_UNCHANGED",
                    "USER",
                    user.getEmail(),
                    "User status already " + (target ? "ENABLED" : "DISABLED")
            );
            return;
        }

        user.setEnabled(target);
        userRepository.save(user);

        auditService.logEvent(
                "USER_STATUS_UPDATED",
                "USER",
                user.getEmail(),
                "User status updated to " + (target ? "ENABLED" : "DISABLED")
                        + buildReasonSuffix(request.getReason())
        );

        syncPatientStatus(user, target);
    }

    private void syncPatientStatus(User user, boolean enabled) {
        // Tạm thời map đơn giản: enabled -> ACTIVE, disabled -> SUSPENDED
        String patientStatus = enabled ? "ACTIVE" : "SUSPENDED";
        PatientStatusUpdateRequest payload = new PatientStatusUpdateRequest(
                user.getEmail(),
                enabled,
                patientStatus
        );

        patientRegistryClient.updatePatientStatus(payload);
    }

    private String buildReasonSuffix(String reason) {
        if (reason == null || reason.isBlank()) {
            return "";
        }
        return " (reason: " + reason.trim() + ")";
    }
}

