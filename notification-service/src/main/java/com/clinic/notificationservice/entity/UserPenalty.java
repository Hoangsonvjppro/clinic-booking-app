package com.clinic.notificationservice.entity;

import com.clinic.notificationservice.enums.PenaltyType;
import com.clinic.notificationservice.enums.UserType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing a penalty applied to a user.
 * Penalties can include fee multipliers, temporary bans, etc.
 */
@Entity
@Table(name = "user_penalties")
public class UserPenalty {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // === User Information ===
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false, length = 20)
    private UserType userType;

    // === Penalty Details ===
    
    @Enumerated(EnumType.STRING)
    @Column(name = "penalty_type", nullable = false, length = 50)
    private PenaltyType penaltyType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 3, scale = 2)
    private BigDecimal multiplier = BigDecimal.ONE;

    // === Links ===
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    private Report report;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warning_id")
    private Warning warning;

    // === Admin Information ===
    
    @Column(name = "issued_by", nullable = false)
    private UUID issuedBy;

    // === Validity Period ===
    
    @Column(name = "effective_from", nullable = false)
    private Instant effectiveFrom;

    @Column(name = "effective_until")
    private Instant effectiveUntil;

    // === Status ===
    
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    // === Timestamp ===
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // === Constructors ===
    
    public UserPenalty() {
        this.createdAt = Instant.now();
        this.effectiveFrom = Instant.now();
        this.isActive = true;
        this.multiplier = BigDecimal.ONE;
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

    public PenaltyType getPenaltyType() {
        return penaltyType;
    }

    public void setPenaltyType(PenaltyType penaltyType) {
        this.penaltyType = penaltyType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getMultiplier() {
        return multiplier;
    }

    public void setMultiplier(BigDecimal multiplier) {
        this.multiplier = multiplier;
    }

    public Report getReport() {
        return report;
    }

    public void setReport(Report report) {
        this.report = report;
    }

    public Warning getWarning() {
        return warning;
    }

    public void setWarning(Warning warning) {
        this.warning = warning;
    }

    public UUID getIssuedBy() {
        return issuedBy;
    }

    public void setIssuedBy(UUID issuedBy) {
        this.issuedBy = issuedBy;
    }

    public Instant getEffectiveFrom() {
        return effectiveFrom;
    }

    public void setEffectiveFrom(Instant effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }

    public Instant getEffectiveUntil() {
        return effectiveUntil;
    }

    public void setEffectiveUntil(Instant effectiveUntil) {
        this.effectiveUntil = effectiveUntil;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    // === Helper Methods ===
    
    /**
     * Check if penalty is currently in effect
     */
    public boolean isCurrentlyActive() {
        if (!isActive) return false;
        Instant now = Instant.now();
        boolean afterStart = now.isAfter(effectiveFrom) || now.equals(effectiveFrom);
        boolean beforeEnd = effectiveUntil == null || now.isBefore(effectiveUntil);
        return afterStart && beforeEnd;
    }

    /**
     * Check if penalty has expired
     */
    public boolean isExpired() {
        return effectiveUntil != null && Instant.now().isAfter(effectiveUntil);
    }

    /**
     * Deactivate the penalty
     */
    public void deactivate() {
        this.isActive = false;
    }
}
