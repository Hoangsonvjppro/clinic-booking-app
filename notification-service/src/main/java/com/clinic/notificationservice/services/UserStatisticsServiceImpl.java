package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.response.UserStatisticsResponse;
import com.clinic.notificationservice.entity.UserStatistics;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.repository.UserStatisticsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of UserStatisticsService for managing user statistics.
 */
@Service
@Transactional
public class UserStatisticsServiceImpl implements UserStatisticsService {

    private final UserStatisticsRepository statisticsRepository;

    public UserStatisticsServiceImpl(UserStatisticsRepository statisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserStatisticsResponse getStatistics(UUID userId) {
        return statisticsRepository.findByUserId(userId)
                .map(UserStatisticsResponse::fromEntity)
                .orElse(UserStatisticsResponse.empty(userId));
    }

    @Override
    @Transactional(readOnly = true)
    public UserStatisticsResponse getStatistics(UUID userId, UserType userType) {
        return statisticsRepository.findByUserIdAndUserType(userId, userType)
                .map(UserStatisticsResponse::fromEntity)
                .orElse(UserStatisticsResponse.empty(userId, userType));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserStatisticsResponse> getStatisticsByUserType(UserType userType, Pageable pageable) {
        return statisticsRepository.findByUserType(userType, pageable)
                .map(UserStatisticsResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserStatisticsResponse> getTopNoShowUsers(UserType userType, int limit) {
        return statisticsRepository.findTopNoShowUsers(userType, PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(UserStatisticsResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserStatisticsResponse> getTopWarnedUsers(UserType userType, int limit) {
        return statisticsRepository.findTopWarnedUsers(userType, PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(UserStatisticsResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserStatisticsResponse> getTopRatedUsers(UserType userType, int limit) {
        return statisticsRepository.findTopRatedUsers(userType, PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(UserStatisticsResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserStatisticsResponse> getMostActiveUsers(UserType userType, int limit) {
        return statisticsRepository.findMostActiveUsers(userType, PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(UserStatisticsResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void incrementAppointmentCount(UUID userId, UserType userType) {
        UserStatistics stats = getOrCreateEntity(userId, userType);
        stats.setTotalAppointments(stats.getTotalAppointments() + 1);
        stats.setLastAppointmentAt(Instant.now());
        stats.setUpdatedAt(Instant.now());
        statisticsRepository.save(stats);
    }

    @Override
    public void incrementCompletedAppointment(UUID userId) {
        statisticsRepository.findByUserId(userId).ifPresent(stats -> {
            stats.setCompletedAppointments(stats.getCompletedAppointments() + 1);
            stats.setUpdatedAt(Instant.now());
            statisticsRepository.save(stats);
        });
    }

    @Override
    public void incrementCancelledAppointment(UUID userId) {
        statisticsRepository.findByUserId(userId).ifPresent(stats -> {
            stats.setCancelledAppointments(stats.getCancelledAppointments() + 1);
            stats.setUpdatedAt(Instant.now());
            statisticsRepository.save(stats);
        });
    }

    @Override
    public void incrementNoShowCount(UUID userId) {
        statisticsRepository.findByUserId(userId).ifPresent(stats -> {
            stats.setNoShowCount(stats.getNoShowCount() + 1);
            stats.setUpdatedAt(Instant.now());
            statisticsRepository.save(stats);
        });
    }

    @Override
    public void incrementWarningCount(UUID userId) {
        statisticsRepository.findByUserId(userId).ifPresent(stats -> {
            stats.setWarningCount(stats.getWarningCount() + 1);
            stats.setLastWarningAt(Instant.now());
            stats.setUpdatedAt(Instant.now());
            statisticsRepository.save(stats);
        });
    }

    @Override
    public void incrementPenaltyCount(UUID userId) {
        statisticsRepository.findByUserId(userId).ifPresent(stats -> {
            stats.setPenaltyCount(stats.getPenaltyCount() + 1);
            stats.setUpdatedAt(Instant.now());
            statisticsRepository.save(stats);
        });
    }

    @Override
    public void incrementReportCount(UUID userId) {
        statisticsRepository.findByUserId(userId).ifPresent(stats -> {
            stats.setReportCount(stats.getReportCount() + 1);
            stats.setUpdatedAt(Instant.now());
            statisticsRepository.save(stats);
        });
    }

    @Override
    public void incrementReportsFiledCount(UUID userId) {
        statisticsRepository.findByUserId(userId).ifPresent(stats -> {
            stats.setReportsFiledCount(stats.getReportsFiledCount() + 1);
            stats.setUpdatedAt(Instant.now());
            statisticsRepository.save(stats);
        });
    }

    @Override
    public void updateRating(UUID userId, double newRating) {
        statisticsRepository.findByUserId(userId).ifPresent(stats -> {
            int totalRatings = stats.getTotalRatings();
            BigDecimal currentAverage = stats.getAverageRating();
            
            // Calculate new average: ((oldAverage * count) + newRating) / (count + 1)
            BigDecimal totalSum = currentAverage.multiply(BigDecimal.valueOf(totalRatings))
                    .add(BigDecimal.valueOf(newRating));
            BigDecimal newAverage = totalSum.divide(BigDecimal.valueOf(totalRatings + 1), 2, RoundingMode.HALF_UP);
            
            stats.setAverageRating(newAverage);
            stats.setTotalRatings(totalRatings + 1);
            stats.setUpdatedAt(Instant.now());
            statisticsRepository.save(stats);
        });
    }

    @Override
    public UserStatisticsResponse getOrCreateStatistics(UUID userId, UserType userType) {
        UserStatistics stats = getOrCreateEntity(userId, userType);
        return UserStatisticsResponse.fromEntity(stats);
    }

    private UserStatistics getOrCreateEntity(UUID userId, UserType userType) {
        return statisticsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserStatistics newStats = new UserStatistics(userId, userType);
                    return statisticsRepository.save(newStats);
                });
    }
}
