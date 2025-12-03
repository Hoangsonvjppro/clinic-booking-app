package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.request.SendWarningRequest;
import com.clinic.notificationservice.dto.response.WarningResponse;
import com.clinic.notificationservice.enums.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for managing user warnings.
 */
public interface WarningService {

    /**
     * Creates and sends a new warning to a user.
     *
     * @param request the warning request
     * @return the created warning response
     */
    WarningResponse sendWarning(SendWarningRequest request);

    /**
     * Gets a warning by ID.
     *
     * @param warningId the warning ID
     * @return the warning response
     */
    WarningResponse getWarningById(UUID warningId);

    /**
     * Gets all warnings for a specific user.
     *
     * @param userId the user ID
     * @param pageable pagination info
     * @return page of warning responses
     */
    Page<WarningResponse> getWarningsByUser(UUID userId, Pageable pageable);

    /**
     * Gets unread warnings for a specific user.
     *
     * @param userId the user ID
     * @return list of unread warning responses
     */
    List<WarningResponse> getUnreadWarnings(UUID userId);

    /**
     * Marks a warning as read.
     *
     * @param warningId the warning ID
     * @param userId the user ID (to verify ownership)
     * @return updated warning response
     */
    WarningResponse markAsRead(UUID warningId, UUID userId);

    /**
     * Marks all warnings as read for a user.
     *
     * @param userId the user ID
     */
    void markAllAsRead(UUID userId);

    /**
     * Gets all warnings (for admin).
     *
     * @param pageable pagination info
     * @return page of warning responses
     */
    Page<WarningResponse> getAllWarnings(Pageable pageable);

    /**
     * Gets warnings with optional filters (for admin).
     *
     * @param userId optional user ID filter
     * @param userType optional user type filter
     * @param pageable pagination info
     * @return page of filtered warning responses
     */
    Page<WarningResponse> getWarningsWithFilters(UUID userId, UserType userType, Pageable pageable);

    /**
     * Gets warnings linked to a specific report.
     *
     * @param reportId the report ID
     * @return list of warning responses
     */
    List<WarningResponse> getWarningsByReport(UUID reportId);

    /**
     * Counts total warnings for a user.
     *
     * @param userId the user ID
     * @return count of warnings
     */
    long countWarningsByUser(UUID userId);

    /**
     * Counts unread warnings for a user.
     *
     * @param userId the user ID
     * @return count of unread warnings
     */
    long countUnreadWarnings(UUID userId);

    /**
     * Gets active (non-expired) warnings for a user.
     *
     * @param userId the user ID
     * @return list of active warning responses
     */
    List<WarningResponse> getActiveWarnings(UUID userId);

    /**
     * Gets recent warnings for a user.
     *
     * @param userId the user ID
     * @param limit max number of warnings
     * @return list of recent warning responses
     */
    List<WarningResponse> getRecentWarnings(UUID userId, int limit);
}
