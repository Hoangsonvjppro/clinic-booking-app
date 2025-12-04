package com.clinic.doctorservice.dto;

import java.math.BigDecimal;

public class FeeSettingsResponse {
    private BigDecimal consultationFee;
    private BigDecimal followUpFee;
    private BigDecimal emergencyFee;
    private Integer consultationDuration;

    public FeeSettingsResponse() {}

    public FeeSettingsResponse(BigDecimal consultationFee, BigDecimal followUpFee, 
                               BigDecimal emergencyFee, Integer consultationDuration) {
        this.consultationFee = consultationFee;
        this.followUpFee = followUpFee;
        this.emergencyFee = emergencyFee;
        this.consultationDuration = consultationDuration;
    }

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public BigDecimal getFollowUpFee() {
        return followUpFee;
    }

    public void setFollowUpFee(BigDecimal followUpFee) {
        this.followUpFee = followUpFee;
    }

    public BigDecimal getEmergencyFee() {
        return emergencyFee;
    }

    public void setEmergencyFee(BigDecimal emergencyFee) {
        this.emergencyFee = emergencyFee;
    }

    public Integer getConsultationDuration() {
        return consultationDuration;
    }

    public void setConsultationDuration(Integer consultationDuration) {
        this.consultationDuration = consultationDuration;
    }
}
