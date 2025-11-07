package com.clinic.patientservice.web;

import com.clinic.patientservice.service.PatientService;
import com.clinic.patientservice.web.dto.InternalPatientStatusUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("https://hoofed-alfonzo-conclusional.ngrok-free.dev")
@RestController
@RequestMapping("/internal/patients")
public class InternalPatientController {

    private final PatientService patientService;

    public InternalPatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PutMapping("/status")
    public ResponseEntity<Void> updateStatus(@Valid @RequestBody InternalPatientStatusUpdateRequest request) {
        patientService.updateStatusByEmail(request.getEmail(), request.getActive(), request.getStatus());
        return ResponseEntity.noContent().build();
    }
}
