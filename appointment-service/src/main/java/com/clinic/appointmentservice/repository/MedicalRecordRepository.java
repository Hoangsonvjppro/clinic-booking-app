package com.clinic.appointmentservice.repository;

import com.clinic.appointmentservice.domain.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {
    Optional<MedicalRecord> findByAppointmentId(UUID appointmentId);
    java.util.List<MedicalRecord> findByAppointmentIdIn(java.util.List<UUID> appointmentIds);
}
