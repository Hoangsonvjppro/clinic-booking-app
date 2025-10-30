package com.clinic.appointmentservice.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "appointment_status")
public class AppointmentStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "code", nullable = false, unique = true, length = 32)
    private AppointmentStatusCode code;

    @Column(name = "display_name", nullable = false, length = 64)
    private String displayName;

    protected AppointmentStatus() {
        // for JPA
    }

    public AppointmentStatus(AppointmentStatusCode code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public Long getId() {
        return id;
    }

    public AppointmentStatusCode getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }
}
