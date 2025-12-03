package com.clinic.notificationservice.controller;

import com.clinic.notificationservice.dto.response.DashboardStatsResponse;
import com.clinic.notificationservice.dto.response.UserStatisticsResponse;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.services.AdminDashboardService;
import com.clinic.notificationservice.services.UserStatisticsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin controller for statistics and dashboard.
 * Provides platform-wide statistics and user insights.
 */
@RestController
@RequestMapping("/api/v1/admin/statistics")
public class AdminStatisticsController {

    private final AdminDashboardService dashboardService;
    private final UserStatisticsService statisticsService;

    public AdminStatisticsController(AdminDashboardService dashboardService,
                                     UserStatisticsService statisticsService) {
        this.dashboardService = dashboardService;
        this.statisticsService = statisticsService;
    }

    /**
     * Gets comprehensive dashboard statistics.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Gets statistics for a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserStatisticsResponse> getUserStatistics(
            @PathVariable UUID userId) {
        UserStatisticsResponse stats = statisticsService.getStatistics(userId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Gets statistics for users by type.
     */
    @GetMapping("/users")
    public ResponseEntity<Page<UserStatisticsResponse>> getUserStatisticsByType(
            @RequestParam UserType userType,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<UserStatisticsResponse> stats = statisticsService.getStatisticsByUserType(userType, pageable);
        return ResponseEntity.ok(stats);
    }

    /**
     * Gets top users with most no-shows.
     */
    @GetMapping("/top-no-shows")
    public ResponseEntity<List<UserStatisticsResponse>> getTopNoShowUsers(
            @RequestParam UserType userType,
            @RequestParam(defaultValue = "10") int limit) {
        List<UserStatisticsResponse> users = statisticsService.getTopNoShowUsers(userType, limit);
        return ResponseEntity.ok(users);
    }

    /**
     * Gets top users with most warnings.
     */
    @GetMapping("/top-warned")
    public ResponseEntity<List<UserStatisticsResponse>> getTopWarnedUsers(
            @RequestParam UserType userType,
            @RequestParam(defaultValue = "10") int limit) {
        List<UserStatisticsResponse> users = statisticsService.getTopWarnedUsers(userType, limit);
        return ResponseEntity.ok(users);
    }

    /**
     * Gets top rated users (typically doctors).
     */
    @GetMapping("/top-rated")
    public ResponseEntity<List<UserStatisticsResponse>> getTopRatedUsers(
            @RequestParam UserType userType,
            @RequestParam(defaultValue = "10") int limit) {
        List<UserStatisticsResponse> users = statisticsService.getTopRatedUsers(userType, limit);
        return ResponseEntity.ok(users);
    }

    /**
     * Gets most active users by completed appointments.
     */
    @GetMapping("/most-active")
    public ResponseEntity<List<UserStatisticsResponse>> getMostActiveUsers(
            @RequestParam UserType userType,
            @RequestParam(defaultValue = "10") int limit) {
        List<UserStatisticsResponse> users = statisticsService.getMostActiveUsers(userType, limit);
        return ResponseEntity.ok(users);
    }
}
