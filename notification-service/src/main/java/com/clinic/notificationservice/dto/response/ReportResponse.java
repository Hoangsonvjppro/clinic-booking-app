package com.clinic.notificationservice.dto.response;

import com.clinic.notificationservice.entity.Report;
import com.clinic.notificationservice.enums.ReportStatus;
import com.clinic.notificationservice.enums.ReportType;
import com.clinic.notificationservice.enums.Resolution;
import com.clinic.notificationservice.enums.UserType;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for report data.
 */
public class ReportResponse {

    private UUID id;
    private UUID reporterId;
    private UserType reporterType;
    private String reporterName; // Populated from external service
    private UUID reportedId;
    private UserType reportedType;
    private String reportedName; // Populated from external service
    private ReportType reportType;
    private UUID appointmentId;
    private String title;
    private String description;
    private List<String> evidenceUrls;
    private ReportStatus status;
    private UUID adminId;
    private String adminName; // Populated from external service
    private String adminNotes;
    private Resolution resolution;
    private Instant resolvedAt;
    private Instant createdAt;
    private Instant updatedAt;

    // === Constructors ===

    public ReportResponse() {
    }

    public static ReportResponse fromEntity(Report report) {
        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setReporterId(report.getReporterId());
        response.setReporterType(report.getReporterType());
        response.setReportedId(report.getReportedId());
        response.setReportedType(report.getReportedType());
        response.setReportType(report.getReportType());
        response.setAppointmentId(report.getAppointmentId());
        response.setTitle(report.getTitle());
        response.setDescription(report.getDescription());
        response.setEvidenceUrls(report.getEvidenceUrls());
        response.setStatus(report.getStatus());
        response.setAdminId(report.getAdminId());
        response.setAdminNotes(report.getAdminNotes());
        response.setResolution(report.getResolution());
        response.setResolvedAt(report.getResolvedAt());
        response.setCreatedAt(report.getCreatedAt());
        response.setUpdatedAt(report.getUpdatedAt());
        return response;
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

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
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

    public String getReportedName() {
        return reportedName;
    }

    public void setReportedName(String reportedName) {
        this.reportedName = reportedName;
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

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
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
}
