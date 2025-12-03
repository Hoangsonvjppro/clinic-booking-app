package com.clinic.notificationservice.dto.response;

/**
 * Response DTO for admin dashboard statistics.
 */
public class DashboardStatsResponse {

    // User counts
    private long totalUsers;
    private long totalDoctors;
    private long totalPatients;
    
    // Report statistics
    private long pendingReports;
    private long reviewingReports;
    private long resolvedReports;
    private long totalReports;
    
    // Warning statistics
    private long activeWarnings;
    private long unreadWarnings;
    private long totalWarnings;
    
    // Penalty statistics
    private long activePenalties;
    private long totalPenalties;
    
    // Appointment statistics (if available)
    private long appointmentsToday;
    private long appointmentsThisWeek;
    private long appointmentsThisMonth;
    
    // Revenue (if available)
    private Double revenueThisMonth;

    // === Constructors ===

    public DashboardStatsResponse() {
    }

    // === Builder Pattern ===
    
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final DashboardStatsResponse response = new DashboardStatsResponse();

        public Builder totalUsers(long totalUsers) {
            response.totalUsers = totalUsers;
            return this;
        }

        public Builder totalDoctors(long totalDoctors) {
            response.totalDoctors = totalDoctors;
            return this;
        }

        public Builder totalPatients(long totalPatients) {
            response.totalPatients = totalPatients;
            return this;
        }

        public Builder pendingReports(long pendingReports) {
            response.pendingReports = pendingReports;
            return this;
        }

        public Builder reviewingReports(long reviewingReports) {
            response.reviewingReports = reviewingReports;
            return this;
        }

        public Builder resolvedReports(long resolvedReports) {
            response.resolvedReports = resolvedReports;
            return this;
        }

        public Builder totalReports(long totalReports) {
            response.totalReports = totalReports;
            return this;
        }

        public Builder activeWarnings(long activeWarnings) {
            response.activeWarnings = activeWarnings;
            return this;
        }

        public Builder unreadWarnings(long unreadWarnings) {
            response.unreadWarnings = unreadWarnings;
            return this;
        }

        public Builder totalWarnings(long totalWarnings) {
            response.totalWarnings = totalWarnings;
            return this;
        }

        public Builder activePenalties(long activePenalties) {
            response.activePenalties = activePenalties;
            return this;
        }

        public Builder totalPenalties(long totalPenalties) {
            response.totalPenalties = totalPenalties;
            return this;
        }

        public Builder appointmentsToday(long appointmentsToday) {
            response.appointmentsToday = appointmentsToday;
            return this;
        }

        public Builder appointmentsThisWeek(long appointmentsThisWeek) {
            response.appointmentsThisWeek = appointmentsThisWeek;
            return this;
        }

        public Builder appointmentsThisMonth(long appointmentsThisMonth) {
            response.appointmentsThisMonth = appointmentsThisMonth;
            return this;
        }

        public Builder revenueThisMonth(Double revenueThisMonth) {
            response.revenueThisMonth = revenueThisMonth;
            return this;
        }

        public DashboardStatsResponse build() {
            return response;
        }
    }

    // === Getters and Setters ===

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getPendingReports() {
        return pendingReports;
    }

    public void setPendingReports(long pendingReports) {
        this.pendingReports = pendingReports;
    }

    public long getReviewingReports() {
        return reviewingReports;
    }

    public void setReviewingReports(long reviewingReports) {
        this.reviewingReports = reviewingReports;
    }

    public long getResolvedReports() {
        return resolvedReports;
    }

    public void setResolvedReports(long resolvedReports) {
        this.resolvedReports = resolvedReports;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getActiveWarnings() {
        return activeWarnings;
    }

    public void setActiveWarnings(long activeWarnings) {
        this.activeWarnings = activeWarnings;
    }

    public long getUnreadWarnings() {
        return unreadWarnings;
    }

    public void setUnreadWarnings(long unreadWarnings) {
        this.unreadWarnings = unreadWarnings;
    }

    public long getTotalWarnings() {
        return totalWarnings;
    }

    public void setTotalWarnings(long totalWarnings) {
        this.totalWarnings = totalWarnings;
    }

    public long getActivePenalties() {
        return activePenalties;
    }

    public void setActivePenalties(long activePenalties) {
        this.activePenalties = activePenalties;
    }

    public long getTotalPenalties() {
        return totalPenalties;
    }

    public void setTotalPenalties(long totalPenalties) {
        this.totalPenalties = totalPenalties;
    }

    public long getAppointmentsToday() {
        return appointmentsToday;
    }

    public void setAppointmentsToday(long appointmentsToday) {
        this.appointmentsToday = appointmentsToday;
    }

    public long getAppointmentsThisWeek() {
        return appointmentsThisWeek;
    }

    public void setAppointmentsThisWeek(long appointmentsThisWeek) {
        this.appointmentsThisWeek = appointmentsThisWeek;
    }

    public long getAppointmentsThisMonth() {
        return appointmentsThisMonth;
    }

    public void setAppointmentsThisMonth(long appointmentsThisMonth) {
        this.appointmentsThisMonth = appointmentsThisMonth;
    }

    public Double getRevenueThisMonth() {
        return revenueThisMonth;
    }

    public void setRevenueThisMonth(Double revenueThisMonth) {
        this.revenueThisMonth = revenueThisMonth;
    }
}
