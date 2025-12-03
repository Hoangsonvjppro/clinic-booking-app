package com.clinic.notificationservice.dto.request;

import com.clinic.notificationservice.enums.ReportType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

/**
 * Request DTO for creating a new report.
 */
public class CreateReportRequest {

    @NotNull(message = "Reported user ID is required")
    private UUID reportedId;

    @NotNull(message = "Report type is required")
    private ReportType reportType;

    private UUID appointmentId;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    private List<String> evidenceUrls;

    // === Constructors ===

    public CreateReportRequest() {
    }

    public CreateReportRequest(UUID reportedId, ReportType reportType, String title, String description) {
        this.reportedId = reportedId;
        this.reportType = reportType;
        this.title = title;
        this.description = description;
    }

    // === Getters and Setters ===

    public UUID getReportedId() {
        return reportedId;
    }

    public void setReportedId(UUID reportedId) {
        this.reportedId = reportedId;
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
}
