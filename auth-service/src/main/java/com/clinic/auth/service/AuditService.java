package com.clinic.auth.service;

import com.clinic.auth.model.AuditLog;
import com.clinic.auth.model.User;
import com.clinic.auth.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void logEvent(String action, String entityType, String entityId, String details) {
        logEvent(action, entityType, entityId, Map.of("message", details), null);
    }

    public void logEvent(String action, String entityType, String entityId, String details, String errorMessage) {
        logEvent(action, entityType, entityId, Map.of("message", details), errorMessage);
    }

    public void logEvent(String action,
                         String entityType,
                         String entityId,
                         Map<String, Object> details,
                         String errorMessage) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            HttpServletRequest request = getCurrentRequest();

            User actor = resolveUser(authentication);
            String subject = buildSubject(entityType, entityId);
            String ipAddress = request != null ? getClientIp(request) : null;
            String userAgent = request != null ? request.getHeader("User-Agent") : null;

            // TODO: Re-enable audit logging when audit_logs table is created
            // AuditLog log = AuditLog.builder()
            //         .action(action)
            //         .user(actor)
            //         .subject(subject)
            //         .details(details)
            //         .ipAddress(ipAddress)
            //         .userAgent(userAgent)
            //         .status(errorMessage != null ? "FAILED" : "SUCCESS")
            //         .errorMessage(errorMessage)
            //         .build();
            //
            // auditLogRepository.save(log);
            
            System.out.println("Audit log disabled - Action: " + action + ", Subject: " + buildSubject(entityType, entityId));
        } catch (Exception e) {
            System.err.println("Failed to save audit log: " + e.getMessage());
        }
    }

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest() : null;
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        return xf != null ? xf.split(",")[0] : request.getRemoteAddr();
    }

    private User resolveUser(Authentication authentication) {
        if (authentication == null) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user;
        }
        return null;
    }

    private String buildSubject(String entityType, String entityId) {
        if (entityType != null && entityId != null) {
            return entityType + ":" + entityId;
        }
        if (entityId != null) {
            return entityId;
        }
        return entityType;
    }
}
