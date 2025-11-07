package com.clinic.doctorservice.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor
public class ApplyDoctorRequest {
    private UUID userId;
    private String hospitalEmail;
    private String address;
    private String phone;
    private String description;
    private String paymentMethods; // comma separated: CREDIT,CASH,INSTALLMENT

    // files handled by controller as MultipartFile[] - not inside this DTO for simplicity

}