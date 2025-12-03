package com.clinic.notificationservice.dto.response;

import com.clinic.notificationservice.entity.UserStatistics;
import com.clinic.notificationservice.enums.UserType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for user statistics data.
 */
public class UserStatisticsResponse {

    private UUID id;
    private UUID userId;
    private UserType userType;
    private String userName; // Populated from external service
    
    // Appointment stats
    private int totalAppointments;
    private int completedAppointments;
    private int cancelledAppointments;
    private int noShowCount;
    private double completionRate;
    private double noShowRate;
    
    // Rating stats
    private BigDecimal averageRating;
    private int totalRatings;
    
    // Warning/Violation stats
    private int warningCount;
    private int penaltyCount;
    private int reportCount;
    private int reportsFiledCount;
    
    // Timestamps
    private Instant lastAppointmentAt;
    private Instant lastWarningAt;
    private Instant createdAt;
    private Instant updatedAt;

    // === Constructors ===

    public UserStatisticsResponse() {
    }

    public static UserStatisticsResponse fromEntity(UserStatistics stats) {
        UserStatisticsResponse response = new UserStatisticsResponse();
        response.setId(stats.getId());
        response.setUserId(stats.getUserId());
        response.setUserType(stats.getUserType());
        response.setTotalAppointments(stats.getTotalAppointments());
        response.setCompletedAppointments(stats.getCompletedAppointments());
        response.setCancelledAppointments(stats.getCancelledAppointments());
        response.setNoShowCount(stats.getNoShowCount());
        response.setCompletionRate(stats.getCompletionRate());
        response.setNoShowRate(stats.getNoShowRate());
        response.setAverageRating(stats.getAverageRating());
        response.setTotalRatings(stats.getTotalRatings());
        response.setWarningCount(stats.getWarningCount());
        response.setPenaltyCount(stats.getPenaltyCount());
        response.setReportCount(stats.getReportCount());
        response.setReportsFiledCount(stats.getReportsFiledCount());
        response.setLastAppointmentAt(stats.getLastAppointmentAt());
        response.setLastWarningAt(stats.getLastWarningAt());
        response.setCreatedAt(stats.getCreatedAt());
        response.setUpdatedAt(stats.getUpdatedAt());
        return response;
    }

    /**
     * Creates an empty statistics response for a user.
     */
    public static UserStatisticsResponse empty(UUID userId) {
        UserStatisticsResponse response = new UserStatisticsResponse();
        response.setUserId(userId);
        response.setTotalAppointments(0);
        response.setCompletedAppointments(0);
        response.setCancelledAppointments(0);
        response.setNoShowCount(0);
        response.setCompletionRate(0.0);
        response.setNoShowRate(0.0);
        response.setAverageRating(java.math.BigDecimal.ZERO);
        response.setTotalRatings(0);
        response.setWarningCount(0);
        response.setPenaltyCount(0);
        response.setReportCount(0);
        response.setReportsFiledCount(0);
        return response;
    }

    /**
     * Creates an empty statistics response for a user with type.
     */
    public static UserStatisticsResponse empty(UUID userId, UserType userType) {
        UserStatisticsResponse response = empty(userId);
        response.setUserType(userType);
        return response;
    }

    // === Getters and Setters ===

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(int totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public int getCompletedAppointments() {
        return completedAppointments;
    }

    public void setCompletedAppointments(int completedAppointments) {
        this.completedAppointments = completedAppointments;
    }

    public int getCancelledAppointments() {
        return cancelledAppointments;
    }

    public void setCancelledAppointments(int cancelledAppointments) {
        this.cancelledAppointments = cancelledAppointments;
    }

    public int getNoShowCount() {
        return noShowCount;
    }

    public void setNoShowCount(int noShowCount) {
        this.noShowCount = noShowCount;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public double getNoShowRate() {
        return noShowRate;
    }

    public void setNoShowRate(double noShowRate) {
        this.noShowRate = noShowRate;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    public int getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(int totalRatings) {
        this.totalRatings = totalRatings;
    }

    public int getWarningCount() {
        return warningCount;
    }

    public void setWarningCount(int warningCount) {
        this.warningCount = warningCount;
    }

    public int getPenaltyCount() {
        return penaltyCount;
    }

    public void setPenaltyCount(int penaltyCount) {
        this.penaltyCount = penaltyCount;
    }

    public int getReportCount() {
        return reportCount;
    }

    public void setReportCount(int reportCount) {
        this.reportCount = reportCount;
    }

    public int getReportsFiledCount() {
        return reportsFiledCount;
    }

    public void setReportsFiledCount(int reportsFiledCount) {
        this.reportsFiledCount = reportsFiledCount;
    }

    public Instant getLastAppointmentAt() {
        return lastAppointmentAt;
    }

    public void setLastAppointmentAt(Instant lastAppointmentAt) {
        this.lastAppointmentAt = lastAppointmentAt;
    }

    public Instant getLastWarningAt() {
        return lastWarningAt;
    }

    public void setLastWarningAt(Instant lastWarningAt) {
        this.lastWarningAt = lastWarningAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
