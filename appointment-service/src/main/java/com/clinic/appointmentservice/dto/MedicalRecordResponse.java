package com.clinic.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordResponse {
    private UUID id;
    private UUID appointmentId;
    private String diagnosis;
    private String prescription;
    private String doctorNotes;
    private List<String> attachments;
    private Instant createdAt;
    private Instant updatedAt;
}
