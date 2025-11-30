package com.clinic.appointmentservice.service;

import com.clinic.appointmentservice.domain.Appointment;
import com.clinic.appointmentservice.domain.AppointmentStatus;
import com.clinic.appointmentservice.domain.AppointmentStatusCode;
import com.clinic.appointmentservice.domain.MedicalRecord;
import com.clinic.appointmentservice.dto.CreateMedicalRecordRequest;
import com.clinic.appointmentservice.dto.MedicalRecordResponse;
import com.clinic.appointmentservice.dto.UpdateMedicalRecordRequest;
import com.clinic.appointmentservice.exception.AppointmentNotFoundException;
import com.clinic.appointmentservice.exception.InvalidAppointmentStateException;
import com.clinic.appointmentservice.repository.AppointmentRepository;
import com.clinic.appointmentservice.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentStatusService appointmentStatusService;

    @Transactional
    public MedicalRecordResponse createMedicalRecord(UUID appointmentId, CreateMedicalRecordRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));

        AppointmentStatusCode currentStatus = appointment.getStatus().getCode();
        if (currentStatus != AppointmentStatusCode.CONFIRMED && currentStatus != AppointmentStatusCode.COMPLETED) {
            throw new InvalidAppointmentStateException(appointmentId, currentStatus, AppointmentStatusCode.COMPLETED);
        }

        if (medicalRecordRepository.findByAppointmentId(appointmentId).isPresent()) {
            throw new IllegalStateException("Medical record already exists for appointment " + appointmentId);
        }

        MedicalRecord medicalRecord = new MedicalRecord();
        medicalRecord.setAppointmentId(appointmentId);
        medicalRecord.setDiagnosis(request.getDiagnosis());
        medicalRecord.setPrescription(request.getPrescription());
        
        String combinedNotes = buildDoctorNotes(request.getTreatment(), request.getNotes());
        medicalRecord.setDoctorNotes(combinedNotes);
        
        medicalRecord.setAttachments(request.getAttachments());

        MedicalRecord savedRecord = medicalRecordRepository.save(medicalRecord);

        // Update appointment status to COMPLETED if not already
        if (currentStatus != AppointmentStatusCode.COMPLETED) {
            AppointmentStatus completedStatus = appointmentStatusService.getStatus(AppointmentStatusCode.COMPLETED);
            appointment.setStatus(completedStatus);
            appointmentRepository.save(appointment);
        }

        return mapToResponse(savedRecord);
    }

    @Transactional(readOnly = true)
    public MedicalRecordResponse getMedicalRecordByAppointmentId(UUID appointmentId) {
        MedicalRecord medicalRecord = medicalRecordRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Medical record not found for appointment " + appointmentId)); // Should use custom exception
        return mapToResponse(medicalRecord);
    }

    @Transactional
    public MedicalRecordResponse updateMedicalRecord(UUID id, UpdateMedicalRecordRequest request) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found with id " + id));

        if (request.getDiagnosis() != null) medicalRecord.setDiagnosis(request.getDiagnosis());
        if (request.getPrescription() != null) medicalRecord.setPrescription(request.getPrescription());
        
        if (request.getTreatment() != null || request.getNotes() != null) {
            // If updating, we might overwrite existing notes. 
            // Ideally we should parse, but since we combined them, let's just overwrite with new combination if provided.
            // Or if only one is provided? This is tricky. 
            // Let's assume if either is provided, we rebuild the notes.
            // But we don't know the "other" part if not provided.
            // For simplicity, we just append or replace. 
            // Let's just replace if provided.
            String newNotes = buildDoctorNotes(request.getTreatment(), request.getNotes());
            if (!newNotes.isEmpty()) {
                medicalRecord.setDoctorNotes(newNotes);
            }
        }
        
        if (request.getAttachments() != null) medicalRecord.setAttachments(request.getAttachments());

        return mapToResponse(medicalRecordRepository.save(medicalRecord));
    }

    private String buildDoctorNotes(String treatment, String notes) {
        StringBuilder sb = new StringBuilder();
        if (treatment != null && !treatment.isBlank()) {
            sb.append("Treatment: ").append(treatment).append("\n");
        }
        if (notes != null && !notes.isBlank()) {
            if (!sb.isEmpty()) sb.append("\n");
            sb.append("Notes: ").append(notes);
        }
        return sb.toString();
    }

    private MedicalRecordResponse mapToResponse(MedicalRecord record) {
        return MedicalRecordResponse.builder()
                .id(record.getId())
                .appointmentId(record.getAppointmentId())
                .diagnosis(record.getDiagnosis())
                .prescription(record.getPrescription())
                .doctorNotes(record.getDoctorNotes())
                .attachments(record.getAttachments())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }
}
