package com.clinic.doctorservice.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "doctor")
public class Doctor {

    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "hospital_name")
    private String hospitalName;

    @Column(name = "hospital_address")
    private String hospitalAddress;

    @Column(name = "auto_accept_patients")
    private Boolean autoAcceptPatients = false;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "certificate_url")
    private String certificateUrl;

    @Column(name = "status")
    private String status = "PENDING";

    @Column(name = "consultation_fee")
    private java.math.BigDecimal consultationFee;

    @Column(name = "bio")
    private String bio;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "doctor_specialties",
        joinColumns = @JoinColumn(name = "doctor_id"),
        inverseJoinColumns = @JoinColumn(name = "specialty_id")
    )
    private java.util.Set<Specialty> specialties = new java.util.HashSet<>();

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getHospitalAddress() {
        return hospitalAddress;
    }

    public void setHospitalAddress(String hospitalAddress) {
        this.hospitalAddress = hospitalAddress;
    }

    public Boolean getAutoAcceptPatients() {
        return autoAcceptPatients;
    }

    public void setAutoAcceptPatients(Boolean autoAcceptPatients) {
        this.autoAcceptPatients = autoAcceptPatients;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCertificateUrl() {
        return certificateUrl;
    }

    public void setCertificateUrl(String certificateUrl) {
        this.certificateUrl = certificateUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public java.math.BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(java.math.BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public java.util.Set<Specialty> getSpecialties() {
        return specialties;
    }

    public void setSpecialties(java.util.Set<Specialty> specialties) {
        this.specialties = specialties;
    }
}
