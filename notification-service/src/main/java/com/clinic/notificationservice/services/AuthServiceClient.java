package com.clinic.notificationservice.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

/**
 * Client service for communicating with Auth Service to update user status.
 * This is used when applying penalties that affect user account status.
 */
@Service
public class AuthServiceClient {
    
    private static final Logger log = LoggerFactory.getLogger(AuthServiceClient.class);

    private final WebClient authWebClient;

    public AuthServiceClient(@Value("${app.services.auth.url:http://auth-service:8081}") String authServiceUrl) {
        this.authWebClient = WebClient.builder()
                .baseUrl(authServiceUrl)
                .build();
    }

    /**
     * Updates a user's account status in the auth service.
     * This is an internal service-to-service call.
     *
     * @param userId the user ID
     * @param accountStatus the new status (ACTIVE, WARNED, SUSPENDED, BANNED)
     * @param reason reason for the status change
     * @return true if successful
     */
    public boolean updateUserAccountStatus(UUID userId, String accountStatus, String reason) {
        try {
            log.info("Updating user {} account status to {} via auth-service", userId, accountStatus);
            
            Map<String, Object> request = Map.of(
                "accountStatus", accountStatus,
                "reason", reason != null ? reason : "Penalty applied by notification service"
            );

            authWebClient.patch()
                    .uri("/api/v1/internal/users/{userId}/status", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .onErrorResume(e -> {
                        log.warn("Failed to update user status in auth-service: {}", e.getMessage());
                        return Mono.empty();
                    })
                    .block();
            
            return true;
        } catch (Exception e) {
            log.error("Error updating user account status in auth-service: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Reactivates a user's account status to ACTIVE.
     *
     * @param userId the user ID
     * @param reason reason for reactivation
     * @return true if successful
     */
    public boolean reactivateUser(UUID userId, String reason) {
        return updateUserAccountStatus(userId, "ACTIVE", reason);
    }
}
