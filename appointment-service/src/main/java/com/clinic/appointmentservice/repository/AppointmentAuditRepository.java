package com.clinic.appointmentservice.repository;

import com.clinic.appointmentservice.domain.AppointmentAudit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentAuditRepository extends JpaRepository<AppointmentAudit, Long> {
}
