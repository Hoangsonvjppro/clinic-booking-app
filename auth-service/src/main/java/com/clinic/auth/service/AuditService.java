package com.clinic.auth.service;

import com.clinic.auth.model.AuditLog;
import com.clinic.auth.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.OffsetDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@EnableAsync
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    /** API tiện: truyền details là String -> bọc vào Map {"message": "..."} */
    @Async
    public void logEvent(String action, String entityType, String entityId, String details) {
        logEvent(action, entityType, entityId, Map.of("message", details), null);
    }

    /** API tiện: truyền details là String + errorMessage */
    @Async
    public void logEvent(String action, String entityType, String entityId, String details, String errorMessage) {
        logEvent(action, entityType, entityId, Map.of("message", details), errorMessage);
    }

    /** API “chuẩn”: truyền details là Map -> lưu thẳng JSONB */
    @Async
    public void logEvent(String action, String entityType, String entityId,
                         Map<String, Object> details, String errorMessage) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            HttpServletRequest request = getCurrentRequest();

            String userEmail = auth != null ? auth.getName() : "anonymous";
            String ipAddress = request != null ? getClientIp(request) : null;
            String userAgent = request != null ? request.getHeader("User-Agent") : null;

            AuditLog log = AuditLog.builder()
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .userEmail(userEmail)
                    .details(details) // <-- Map -> jsonb
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .status(errorMessage != null ? "FAILED" : "SUCCESS")
                    .errorMessage(errorMessage)
                    .createdAt(OffsetDateTime.now().toInstant())
                    .build();

            auditLogRepository.save(log);
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
}
