package com.clinic.doctorservice.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;   

@Entity
@Getter @Setter @NoArgsConstructor
@Table(name = "doctor_applications")
public class DoctorApplication {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String userId;

    private String name;
    private String hospitalEmail;
    private String address;
    private String phone;

    @Column(length = 2000)
    private String description;

    // comma-separated stored paths for simplicity
    @Column(length = 2000)
    private String certificatePaths;

    private String paymentMethods; // e.g. CREDIT,CASH,INSTALLMENT

    @ElementCollection
    @CollectionTable(name = "doctor_application_ratings", joinColumns = @JoinColumn(name = "doctor_application_id"))
    @Column(name = "rating")
    private List<Integer> ratings;

    @Enumerated(EnumType.STRING)
    private DoctorApplicationStatus status = DoctorApplicationStatus.PENDING;

    // Fee settings
    @Column(name = "consultation_fee", precision = 12, scale = 2)
    private BigDecimal consultationFee = BigDecimal.valueOf(300000);

    @Column(name = "follow_up_fee", precision = 12, scale = 2)
    private BigDecimal followUpFee = BigDecimal.valueOf(200000);

    @Column(name = "emergency_fee", precision = 12, scale = 2)
    private BigDecimal emergencyFee = BigDecimal.valueOf(500000);

    @Column(name = "consultation_duration")
    private Integer consultationDuration = 30;

    private OffsetDateTime createdAt = OffsetDateTime.now();

}