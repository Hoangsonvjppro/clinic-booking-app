package com.clinic.notificationservice.entity;

import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.enums.WarningType;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing a warning issued to a user.
 * Warnings are issued by admins for rule violations.
 */
@Entity
@Table(name = "warnings")
public class Warning {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // === Recipient Information ===
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false, length = 20)
    private UserType userType;

    // === Warning Details ===
    
    @Enumerated(EnumType.STRING)
    @Column(name = "warning_type", nullable = false, length = 50)
    private WarningType warningType;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    // === Link to Report ===
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    private Report report;

    // === Admin Information ===
    
    @Column(name = "issued_by", nullable = false)
    private UUID issuedBy;

    // === Read Status ===
    
    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "read_at")
    private Instant readAt;

    // === Expiration ===
    
    @Column(name = "expires_at")
    private Instant expiresAt;

    // === Timestamp ===
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // === Constructors ===
    
    public Warning() {
        this.createdAt = Instant.now();
        this.isRead = false;
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

    public WarningType getWarningType() {
        return warningType;
    }

    public void setWarningType(WarningType warningType) {
        this.warningType = warningType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Report getReport() {
        return report;
    }

    public void setReport(Report report) {
        this.report = report;
    }

    public UUID getIssuedBy() {
        return issuedBy;
    }

    public void setIssuedBy(UUID issuedBy) {
        this.issuedBy = issuedBy;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public Instant getReadAt() {
        return readAt;
    }

    public void setReadAt(Instant readAt) {
        this.readAt = readAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    // === Helper Methods ===
    
    public void markAsRead() {
        this.isRead = true;
        this.readAt = Instant.now();
    }

    public boolean isExpired() {
        return expiresAt != null && Instant.now().isAfter(expiresAt);
    }
}
