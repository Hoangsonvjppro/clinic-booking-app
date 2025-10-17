package com.clinic.patientservice.web.dto;

import com.clinic.patientservice.model.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

public class CreatePatientRequest {
    @NotBlank
    public String firstName;
    @NotBlank
    public String lastName;
    @Email
    @NotBlank
    public String email;
    public String phone;
    @Past
    public LocalDate dateOfBirth;
    public Gender gender;
    public String addressLine;
    public String city;
    public String state;
    public String postalCode;
    public String country;
}

