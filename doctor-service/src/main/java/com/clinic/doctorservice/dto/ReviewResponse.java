package com.clinic.doctorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String patientName; // Placeholder or fetched from Patient Service
    private Double rating;
    private String comment;
    private Instant createdAt;
}
