package com.clinic.notificationservice.dto.request;

import com.clinic.notificationservice.enums.PenaltyType;
import com.clinic.notificationservice.enums.Resolution;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * Request DTO for resolving a report (Admin action).
 */
public class ResolveReportRequest {

    // Admin ID - set from controller header
    private UUID adminId;

    @NotNull(message = "Resolution is required")
    private Resolution resolution;

    @Size(max = 2000, message = "Admin notes must not exceed 2000 characters")
    private String adminNotes;

    // For WARNING resolution
    private String warningMessage;

    // For PENALTY resolution
    private PenaltyType penaltyType;
    private Integer penaltyDurationDays; // null = permanent

    // For SUSPEND resolution
    private Integer suspendDays;

    // === Constructors ===

    public ResolveReportRequest() {
    }

    // === Getters and Setters ===

    public UUID getAdminId() {
        return adminId;
    }

    public void setAdminId(UUID adminId) {
        this.adminId = adminId;
    }

    public Resolution getResolution() {
        return resolution;
    }

    public void setResolution(Resolution resolution) {
        this.resolution = resolution;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public String getWarningMessage() {
        return warningMessage;
    }

    public void setWarningMessage(String warningMessage) {
        this.warningMessage = warningMessage;
    }

    public PenaltyType getPenaltyType() {
        return penaltyType;
    }

    public void setPenaltyType(PenaltyType penaltyType) {
        this.penaltyType = penaltyType;
    }

    public Integer getPenaltyDurationDays() {
        return penaltyDurationDays;
    }

    public void setPenaltyDurationDays(Integer penaltyDurationDays) {
        this.penaltyDurationDays = penaltyDurationDays;
    }

    public Integer getSuspendDays() {
        return suspendDays;
    }

    public void setSuspendDays(Integer suspendDays) {
        this.suspendDays = suspendDays;
    }
}
