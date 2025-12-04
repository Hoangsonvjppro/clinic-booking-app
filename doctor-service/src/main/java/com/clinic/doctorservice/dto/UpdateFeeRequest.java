package com.clinic.doctorservice.dto;

import java.math.BigDecimal;

public class UpdateFeeRequest {
    private BigDecimal consultationFee;
    private BigDecimal followUpFee;
    private BigDecimal emergencyFee;
    private Integer consultationDuration;

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
