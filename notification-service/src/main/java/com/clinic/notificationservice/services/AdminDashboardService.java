package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.response.DashboardStatsResponse;

/**
 * Service interface for admin dashboard statistics.
 */
public interface AdminDashboardService {

    /**
     * Gets comprehensive dashboard statistics for admin.
     *
     * @return dashboard statistics response
     */
    DashboardStatsResponse getDashboardStats();
}
