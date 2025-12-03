package com.clinic.notificationservice.entity;

import com.clinic.notificationservice.enums.ReportStatus;
import com.clinic.notificationservice.enums.ReportType;
import com.clinic.notificationservice.enums.Resolution;
import com.clinic.notificationservice.enums.UserType;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Entity representing a user violation report.
 * Reports can be filed by patients against doctors and vice versa.
 */
@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // === Reporter Information ===
    
    @Column(name = "reporter_id", nullable = false)
    private UUID reporterId;

    @Enumerated(EnumType.STRING)
    @Column(name = "reporter_type", nullable = false, length = 20)
    private UserType reporterType;

    // === Reported User Information ===
    
    @Column(name = "reported_id", nullable = false)
    private UUID reportedId;

    @Enumerated(EnumType.STRING)
    @Column(name = "reported_type", nullable = false, length = 20)
    private UserType reportedType;

    // === Report Details ===
    
    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", nullable = false, length = 50)
    private ReportType reportType;

    @Column(name = "appointment_id")
    private UUID appointmentId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "evidence_urls", columnDefinition = "TEXT[]")
    private List<String> evidenceUrls;

    // === Processing Status ===
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReportStatus status = ReportStatus.PENDING;

    // === Admin Resolution ===
    
    @Column(name = "admin_id")
    private UUID adminId;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Resolution resolution;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    // === Timestamps ===
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // === Constructors ===
    
    public Report() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.status = ReportStatus.PENDING;
    }

    // === Getters and Setters ===

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getReporterId() {
        return reporterId;
    }

    public void setReporterId(UUID reporterId) {
        this.reporterId = reporterId;
    }

    public UserType getReporterType() {
        return reporterType;
    }

    public void setReporterType(UserType reporterType) {
        this.reporterType = reporterType;
    }

    public UUID getReportedId() {
        return reportedId;
    }

    public void setReportedId(UUID reportedId) {
        this.reportedId = reportedId;
    }

    public UserType getReportedType() {
        return reportedType;
    }

    public void setReportedType(UserType reportedType) {
        this.reportedType = reportedType;
    }

    public ReportType getReportType() {
        return reportType;
    }

    public void setReportType(ReportType reportType) {
        this.reportType = reportType;
    }

    public UUID getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(UUID appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getEvidenceUrls() {
        return evidenceUrls;
    }

    public void setEvidenceUrls(List<String> evidenceUrls) {
        this.evidenceUrls = evidenceUrls;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public UUID getAdminId() {
        return adminId;
    }

    public void setAdminId(UUID adminId) {
        this.adminId = adminId;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public Resolution getResolution() {
        return resolution;
    }

    public void setResolution(Resolution resolution) {
        this.resolution = resolution;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
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
}
