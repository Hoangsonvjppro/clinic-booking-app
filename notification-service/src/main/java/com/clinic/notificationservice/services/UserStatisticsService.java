package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.response.UserStatisticsResponse;
import com.clinic.notificationservice.enums.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for managing user statistics.
 */
public interface UserStatisticsService {

    /**
     * Gets statistics for a specific user.
     * Creates default statistics if none exist.
     *
     * @param userId the user ID
     * @return the user statistics response
     */
    UserStatisticsResponse getStatistics(UUID userId);

    /**
     * Gets statistics for a specific user with type.
     *
     * @param userId the user ID
     * @param userType the user type
     * @return the user statistics response
     */
    UserStatisticsResponse getStatistics(UUID userId, UserType userType);

    /**
     * Gets statistics for users by type (for admin).
     *
     * @param userType the user type
     * @param pageable pagination info
     * @return page of user statistics
     */
    Page<UserStatisticsResponse> getStatisticsByUserType(UserType userType, Pageable pageable);

    /**
     * Gets top users with most no-shows.
     *
     * @param userType the user type
     * @param limit max number of users
     * @return list of user statistics
     */
    List<UserStatisticsResponse> getTopNoShowUsers(UserType userType, int limit);

    /**
     * Gets top users with most warnings.
     *
     * @param userType the user type
     * @param limit max number of users
     * @return list of user statistics
     */
    List<UserStatisticsResponse> getTopWarnedUsers(UserType userType, int limit);

    /**
     * Gets top rated users.
     *
     * @param userType the user type
     * @param limit max number of users
     * @return list of user statistics
     */
    List<UserStatisticsResponse> getTopRatedUsers(UserType userType, int limit);

    /**
     * Gets most active users by completed appointments.
     *
     * @param userType the user type
     * @param limit max number of users
     * @return list of user statistics
     */
    List<UserStatisticsResponse> getMostActiveUsers(UserType userType, int limit);

    /**
     * Increments appointment count for a user.
     *
     * @param userId the user ID
     * @param userType the user type
     */
    void incrementAppointmentCount(UUID userId, UserType userType);

    /**
     * Increments completed appointment count for a user.
     *
     * @param userId the user ID
     */
    void incrementCompletedAppointment(UUID userId);

    /**
     * Increments cancelled appointment count for a user.
     *
     * @param userId the user ID
     */
    void incrementCancelledAppointment(UUID userId);

    /**
     * Increments no-show count for a user.
     *
     * @param userId the user ID
     */
    void incrementNoShowCount(UUID userId);

    /**
     * Increments warning count for a user.
     *
     * @param userId the user ID
     */
    void incrementWarningCount(UUID userId);

    /**
     * Increments penalty count for a user.
     *
     * @param userId the user ID
     */
    void incrementPenaltyCount(UUID userId);

    /**
     * Increments report received count for a user.
     *
     * @param userId the user ID
     */
    void incrementReportCount(UUID userId);

    /**
     * Increments report filed count for a user.
     *
     * @param userId the user ID
     */
    void incrementReportsFiledCount(UUID userId);

    /**
     * Updates rating for a user.
     *
     * @param userId the user ID
     * @param newRating the new rating value
     */
    void updateRating(UUID userId, double newRating);

    /**
     * Gets or creates statistics for a user.
     *
     * @param userId the user ID
     * @param userType the user type
     * @return the user statistics response
     */
    UserStatisticsResponse getOrCreateStatistics(UUID userId, UserType userType);
}
