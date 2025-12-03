package com.clinic.notificationservice.dto.response;

import com.clinic.notificationservice.enums.UserType;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for detailed user information from admin view.
 * Aggregates user info with their reports, warnings, penalties, and statistics.
 */
public class UserDetailResponse {

    // Basic user info
    private Long userId;
    private String email;
    private String fullName;
    private UserType userType;
    private String accountStatus;
    
    // Account status details
    private LocalDateTime suspendedUntil;
    private LocalDateTime bannedAt;
    private Long bannedBy;
    
    // Registration info
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    
    // Statistics summary
    private UserStatisticsResponse statistics;
    
    // Recent activity
    private List<ReportResponse> recentReportsReceived;
    private List<ReportResponse> recentReportsMade;
    private List<WarningResponse> recentWarnings;
    private List<PenaltyResponse> activePenalties;
    
    // Counts
    private long totalReportsReceived;
    private long totalReportsMade;
    private long totalWarnings;
    private long totalPenalties;

    // === Constructors ===

    public UserDetailResponse() {
    }

    // === Builder Pattern ===

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final UserDetailResponse response = new UserDetailResponse();

        public Builder userId(Long userId) {
            response.userId = userId;
            return this;
        }

        public Builder email(String email) {
            response.email = email;
            return this;
        }

        public Builder fullName(String fullName) {
            response.fullName = fullName;
            return this;
        }

        public Builder userType(UserType userType) {
            response.userType = userType;
            return this;
        }

        public Builder accountStatus(String accountStatus) {
            response.accountStatus = accountStatus;
            return this;
        }

        public Builder suspendedUntil(LocalDateTime suspendedUntil) {
            response.suspendedUntil = suspendedUntil;
            return this;
        }

        public Builder bannedAt(LocalDateTime bannedAt) {
            response.bannedAt = bannedAt;
            return this;
        }

        public Builder bannedBy(Long bannedBy) {
            response.bannedBy = bannedBy;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            response.createdAt = createdAt;
            return this;
        }

        public Builder lastLoginAt(LocalDateTime lastLoginAt) {
            response.lastLoginAt = lastLoginAt;
            return this;
        }

        public Builder statistics(UserStatisticsResponse statistics) {
            response.statistics = statistics;
            return this;
        }

        public Builder recentReportsReceived(List<ReportResponse> recentReportsReceived) {
            response.recentReportsReceived = recentReportsReceived;
            return this;
        }

        public Builder recentReportsMade(List<ReportResponse> recentReportsMade) {
            response.recentReportsMade = recentReportsMade;
            return this;
        }

        public Builder recentWarnings(List<WarningResponse> recentWarnings) {
            response.recentWarnings = recentWarnings;
            return this;
        }

        public Builder activePenalties(List<PenaltyResponse> activePenalties) {
            response.activePenalties = activePenalties;
            return this;
        }

        public Builder totalReportsReceived(long totalReportsReceived) {
            response.totalReportsReceived = totalReportsReceived;
            return this;
        }

        public Builder totalReportsMade(long totalReportsMade) {
            response.totalReportsMade = totalReportsMade;
            return this;
        }

        public Builder totalWarnings(long totalWarnings) {
            response.totalWarnings = totalWarnings;
            return this;
        }

        public Builder totalPenalties(long totalPenalties) {
            response.totalPenalties = totalPenalties;
            return this;
        }

        public UserDetailResponse build() {
            return response;
        }
    }

    // === Getters and Setters ===

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

    public LocalDateTime getSuspendedUntil() {
        return suspendedUntil;
    }

    public void setSuspendedUntil(LocalDateTime suspendedUntil) {
        this.suspendedUntil = suspendedUntil;
    }

    public LocalDateTime getBannedAt() {
        return bannedAt;
    }

    public void setBannedAt(LocalDateTime bannedAt) {
        this.bannedAt = bannedAt;
    }

    public Long getBannedBy() {
        return bannedBy;
    }

    public void setBannedBy(Long bannedBy) {
        this.bannedBy = bannedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public UserStatisticsResponse getStatistics() {
        return statistics;
    }

    public void setStatistics(UserStatisticsResponse statistics) {
        this.statistics = statistics;
    }

    public List<ReportResponse> getRecentReportsReceived() {
        return recentReportsReceived;
    }

    public void setRecentReportsReceived(List<ReportResponse> recentReportsReceived) {
        this.recentReportsReceived = recentReportsReceived;
    }

    public List<ReportResponse> getRecentReportsMade() {
        return recentReportsMade;
    }

    public void setRecentReportsMade(List<ReportResponse> recentReportsMade) {
        this.recentReportsMade = recentReportsMade;
    }

    public List<WarningResponse> getRecentWarnings() {
        return recentWarnings;
    }

    public void setRecentWarnings(List<WarningResponse> recentWarnings) {
        this.recentWarnings = recentWarnings;
    }

    public List<PenaltyResponse> getActivePenalties() {
        return activePenalties;
    }

    public void setActivePenalties(List<PenaltyResponse> activePenalties) {
        this.activePenalties = activePenalties;
    }

    public long getTotalReportsReceived() {
        return totalReportsReceived;
    }

    public void setTotalReportsReceived(long totalReportsReceived) {
        this.totalReportsReceived = totalReportsReceived;
    }

    public long getTotalReportsMade() {
        return totalReportsMade;
    }

    public void setTotalReportsMade(long totalReportsMade) {
        this.totalReportsMade = totalReportsMade;
    }

    public long getTotalWarnings() {
        return totalWarnings;
    }

    public void setTotalWarnings(long totalWarnings) {
        this.totalWarnings = totalWarnings;
    }

    public long getTotalPenalties() {
        return totalPenalties;
    }

    public void setTotalPenalties(long totalPenalties) {
        this.totalPenalties = totalPenalties;
    }
}
