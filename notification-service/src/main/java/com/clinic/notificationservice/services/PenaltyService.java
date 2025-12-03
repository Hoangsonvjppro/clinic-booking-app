package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.request.ApplyPenaltyRequest;
import com.clinic.notificationservice.dto.response.BookingFeeMultiplierResponse;
import com.clinic.notificationservice.dto.response.PenaltyResponse;
import com.clinic.notificationservice.enums.PenaltyType;
import com.clinic.notificationservice.enums.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for managing user penalties.
 */
public interface PenaltyService {

    /**
     * Applies a new penalty to a user.
     *
     * @param request the penalty request
     * @return the created penalty response
     */
    PenaltyResponse applyPenalty(ApplyPenaltyRequest request);

    /**
     * Gets a penalty by ID.
     *
     * @param penaltyId the penalty ID
     * @return the penalty response
     */
    PenaltyResponse getPenaltyById(UUID penaltyId);

    /**
     * Gets all penalties for a specific user.
     *
     * @param userId the user ID
     * @param pageable pagination info
     * @return page of penalty responses
     */
    Page<PenaltyResponse> getPenaltiesByUser(UUID userId, Pageable pageable);

    /**
     * Gets active penalties for a specific user.
     *
     * @param userId the user ID
     * @return list of active penalty responses
     */
    List<PenaltyResponse> getActivePenalties(UUID userId);

    /**
     * Gets the booking fee multiplier for a user.
     * Returns 1.0 if no active fee penalty exists.
     *
     * @param userId the user ID
     * @return booking fee multiplier response
     */
    BookingFeeMultiplierResponse getBookingFeeMultiplier(UUID userId);

    /**
     * Revokes (deactivates) a penalty.
     *
     * @param penaltyId the penalty ID
     * @param adminId the admin user ID
     * @return updated penalty response
     */
    PenaltyResponse revokePenalty(UUID penaltyId, UUID adminId);

    /**
     * Gets all penalties (for admin).
     *
     * @param pageable pagination info
     * @return page of penalty responses
     */
    Page<PenaltyResponse> getAllPenalties(Pageable pageable);

    /**
     * Gets penalties with optional filters (for admin).
     *
     * @param userId optional user ID filter
     * @param userType optional user type filter
     * @param penaltyType optional penalty type filter
     * @param activeOnly whether to show only active penalties
     * @param pageable pagination info
     * @return page of filtered penalty responses
     */
    Page<PenaltyResponse> getPenaltiesWithFilters(UUID userId, UserType userType, 
                                                   PenaltyType penaltyType, boolean activeOnly, 
                                                   Pageable pageable);

    /**
     * Gets penalties linked to a specific report.
     *
     * @param reportId the report ID
     * @return list of penalty responses
     */
    List<PenaltyResponse> getPenaltiesByReport(UUID reportId);

    /**
     * Gets penalties linked to a specific warning.
     *
     * @param warningId the warning ID
     * @return list of penalty responses
     */
    List<PenaltyResponse> getPenaltiesByWarning(UUID warningId);

    /**
     * Counts total penalties for a user.
     *
     * @param userId the user ID
     * @return count of penalties
     */
    long countPenaltiesByUser(UUID userId);

    /**
     * Counts active penalties for a user.
     *
     * @param userId the user ID
     * @return count of active penalties
     */
    long countActivePenalties(UUID userId);

    /**
     * Checks if a user has any active fee multiplier penalty.
     *
     * @param userId the user ID
     * @return true if user has active fee penalty
     */
    boolean hasActiveFeePenalty(UUID userId);
}
