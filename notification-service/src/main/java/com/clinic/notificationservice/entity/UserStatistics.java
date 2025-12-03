package com.clinic.notificationservice.entity;

import com.clinic.notificationservice.enums.UserType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing aggregated statistics for a user.
 * Statistics are maintained for both patients and doctors.
 */
@Entity
@Table(name = "user_statistics")
public class UserStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // === User Identification ===
    
    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false, length = 20)
    private UserType userType;

    // === Appointment Statistics ===
    
    @Column(name = "total_appointments", nullable = false)
    private int totalAppointments = 0;

    @Column(name = "completed_appointments", nullable = false)
    private int completedAppointments = 0;

    @Column(name = "cancelled_appointments", nullable = false)
    private int cancelledAppointments = 0;

    @Column(name = "no_show_count", nullable = false)
    private int noShowCount = 0;

    // === Rating Statistics ===
    
    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = "total_ratings", nullable = false)
    private int totalRatings = 0;

    // === Warning and Violation Statistics ===
    
    @Column(name = "warning_count", nullable = false)
    private int warningCount = 0;

    @Column(name = "penalty_count", nullable = false)
    private int penaltyCount = 0;

    @Column(name = "report_count", nullable = false)
    private int reportCount = 0;

    @Column(name = "reports_filed_count", nullable = false)
    private int reportsFiledCount = 0;

    // === Important Event Timestamps ===
    
    @Column(name = "last_appointment_at")
    private Instant lastAppointmentAt;

    @Column(name = "last_warning_at")
    private Instant lastWarningAt;

    // === Record Timestamps ===
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // === Constructors ===
    
    public UserStatistics() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UserStatistics(UUID userId, UserType userType) {
        this();
        this.userId = userId;
        this.userType = userType;
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

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    // === Helper Methods ===
    
    public void incrementTotalAppointments() {
        this.totalAppointments++;
        this.lastAppointmentAt = Instant.now();
    }

    public void incrementCompletedAppointments() {
        this.completedAppointments++;
    }

    public void incrementCancelledAppointments() {
        this.cancelledAppointments++;
    }

    public void incrementNoShowCount() {
        this.noShowCount++;
    }

    public void incrementWarningCount() {
        this.warningCount++;
        this.lastWarningAt = Instant.now();
    }

    public void incrementPenaltyCount() {
        this.penaltyCount++;
    }

    public void incrementReportCount() {
        this.reportCount++;
    }

    public void incrementReportsFiledCount() {
        this.reportsFiledCount++;
    }

    /**
     * Update average rating with a new rating value
     */
    public void updateRating(BigDecimal newRating) {
        BigDecimal totalScore = averageRating.multiply(BigDecimal.valueOf(totalRatings));
        totalRatings++;
        averageRating = totalScore.add(newRating).divide(BigDecimal.valueOf(totalRatings), 2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Calculate completion rate
     */
    public double getCompletionRate() {
        if (totalAppointments == 0) return 0;
        return (double) completedAppointments / totalAppointments * 100;
    }

    /**
     * Calculate no-show rate
     */
    public double getNoShowRate() {
        if (totalAppointments == 0) return 0;
        return (double) noShowCount / totalAppointments * 100;
    }
}
