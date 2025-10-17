package com.clinic.patientservice.web.dto;

import com.clinic.patientservice.model.Gender;
import java.time.Instant;
import java.time.LocalDate;

public class PatientResponse {
    public Long id;
    public String patientCode;
    public String firstName;
    public String lastName;
    public String email;
    public String phone;
    public LocalDate dateOfBirth;
    public Gender gender;
    public String addressLine;
    public String city;
    public String state;
    public String postalCode;
    public String country;
    public Instant createdAt;
    public Instant updatedAt;
}
