package com.clinic.doctorservice.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class DeleteDoctorResponse {
    private String message;
    private String userId;
}
