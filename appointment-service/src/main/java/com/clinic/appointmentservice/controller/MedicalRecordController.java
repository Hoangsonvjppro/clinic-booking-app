package com.clinic.appointmentservice.controller;

import com.clinic.appointmentservice.dto.CreateMedicalRecordRequest;
import com.clinic.appointmentservice.dto.MedicalRecordResponse;
import com.clinic.appointmentservice.dto.UpdateMedicalRecordRequest;
import com.clinic.appointmentservice.service.MedicalRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping("/appointments/{appointmentId}/medical-record")
    public ResponseEntity<MedicalRecordResponse> createMedicalRecord(
            @PathVariable UUID appointmentId,
            @Valid @RequestBody CreateMedicalRecordRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicalRecordService.createMedicalRecord(appointmentId, request));
    }

    @GetMapping("/appointments/{appointmentId}/medical-record")
    public ResponseEntity<MedicalRecordResponse> getMedicalRecord(@PathVariable UUID appointmentId) {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordByAppointmentId(appointmentId));
    }

    @PutMapping("/medical-records/{id}")
    public ResponseEntity<MedicalRecordResponse> updateMedicalRecord(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateMedicalRecordRequest request) {
        return ResponseEntity.ok(medicalRecordService.updateMedicalRecord(id, request));
    }
}
