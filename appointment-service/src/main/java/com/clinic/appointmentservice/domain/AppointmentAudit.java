package com.clinic.appointmentservice.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "appointment_audit")
public class AppointmentAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(name = "action", nullable = false, length = 32)
    private String action;

    @Column(name = "performed_by", nullable = false, length = 64)
    private String performedBy;

    @Column(name = "details")
    private String details;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected AppointmentAudit() {
        // for JPA
    }

    public AppointmentAudit(Appointment appointment, String action, String performedBy, String details) {
        this.appointment = appointment;
        this.action = action;
        this.performedBy = performedBy;
        this.details = details;
    }

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public String getAction() {
        return action;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public String getDetails() {
        return details;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
