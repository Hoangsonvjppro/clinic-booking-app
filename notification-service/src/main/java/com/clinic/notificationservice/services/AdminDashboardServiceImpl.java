package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.response.DashboardStatsResponse;
import com.clinic.notificationservice.enums.ReportStatus;
import com.clinic.notificationservice.repository.ReportRepository;
import com.clinic.notificationservice.repository.UserPenaltyRepository;
import com.clinic.notificationservice.repository.UserStatisticsRepository;
import com.clinic.notificationservice.repository.WarningRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Implementation of AdminDashboardService for admin dashboard statistics.
 */
@Service
@Transactional(readOnly = true)
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final ReportRepository reportRepository;
    private final WarningRepository warningRepository;
    private final UserPenaltyRepository penaltyRepository;
    private final UserStatisticsRepository statisticsRepository;

    public AdminDashboardServiceImpl(ReportRepository reportRepository,
                                     WarningRepository warningRepository,
                                     UserPenaltyRepository penaltyRepository,
                                     UserStatisticsRepository statisticsRepository) {
        this.reportRepository = reportRepository;
        this.warningRepository = warningRepository;
        this.penaltyRepository = penaltyRepository;
        this.statisticsRepository = statisticsRepository;
    }

    @Override
    public DashboardStatsResponse getDashboardStats() {
        Instant now = Instant.now();
        
        // Report statistics
        long pendingReports = reportRepository.countByStatus(ReportStatus.PENDING);
        long reviewingReports = reportRepository.countByStatus(ReportStatus.REVIEWING);
        long resolvedReports = reportRepository.countByStatus(ReportStatus.RESOLVED);
        long totalReports = pendingReports + reviewingReports + resolvedReports;
        
        // Warning statistics
        long totalWarnings = warningRepository.count();
        long unreadWarnings = warningRepository.countUnreadWarnings();
        // Active warnings would require custom query, approximating with total for now
        long activeWarnings = totalWarnings;
        
        // Penalty statistics
        long totalPenalties = penaltyRepository.count();
        // Active penalties count from statistics
        long activePenalties = penaltyRepository.findAll().stream()
                .filter(p -> p.isActive() && (p.getEffectiveUntil() == null || p.getEffectiveUntil().isAfter(now)))
                .count();
        
        // User counts would typically come from auth service
        // For now, we can approximate from statistics
        long totalUsers = statisticsRepository.count();
        
        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .pendingReports(pendingReports)
                .reviewingReports(reviewingReports)
                .resolvedReports(resolvedReports)
                .totalReports(totalReports)
                .activeWarnings(activeWarnings)
                .unreadWarnings(unreadWarnings)
                .totalWarnings(totalWarnings)
                .activePenalties(activePenalties)
                .totalPenalties(totalPenalties)
                .build();
    }
}
