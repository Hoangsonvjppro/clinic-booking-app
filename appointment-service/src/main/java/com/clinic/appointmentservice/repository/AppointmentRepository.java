package com.clinic.appointmentservice.repository;

import com.clinic.appointmentservice.domain.Appointment;
import com.clinic.appointmentservice.domain.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    boolean existsByDoctorIdAndAppointmentTime(UUID doctorId, LocalDateTime appointmentTime);

    Optional<Appointment> findByIdAndDoctorId(UUID id, UUID doctorId);

    Optional<Appointment> findByIdAndPatientId(UUID id, UUID patientId);

    List<Appointment> findAllByPatientId(UUID patientId);

    List<Appointment> findAllByDoctorId(UUID doctorId);

    List<Appointment> findAllByStatus(AppointmentStatus status);
}
