package com.clinic.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMedicalRecordRequest {
    private String diagnosis;
    private String prescription;
    private String treatment;
    private String notes;
    private List<String> attachments;
}
