package com.clinic.appointmentservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMedicalRecordRequest {
    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    private String prescription; // JSON string
    private String treatment;
    private String notes;
    private List<String> attachments;
}
