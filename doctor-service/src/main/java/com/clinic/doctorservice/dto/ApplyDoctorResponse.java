package com.clinic.doctorservice.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ApplyDoctorResponse {
    private UUID applicationId;
    private String status;
    
    public ApplyDoctorResponse(UUID applicationId, String status) {
        this.applicationId = applicationId;
        this.status = status;
    }
}