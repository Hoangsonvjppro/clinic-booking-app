package com.clinic.appointmentservice.repository;

import com.clinic.appointmentservice.domain.AppointmentStatus;
import com.clinic.appointmentservice.domain.AppointmentStatusCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppointmentStatusRepository extends JpaRepository<AppointmentStatus, Long> {

    Optional<AppointmentStatus> findByCode(AppointmentStatusCode code);
}
