package com.clinic.patientservice.web;

import com.clinic.patientservice.model.Patient;
import com.clinic.patientservice.service.PatientService;
import com.clinic.patientservice.web.dto.CreatePatientRequest;
import com.clinic.patientservice.web.dto.PatientResponse;
import com.clinic.patientservice.web.dto.UpdatePatientRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/patients", "/api/patients"})
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public Page<PatientResponse> list(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size) {
        return patientService.list(page, size).map(PatientController::toDto);
    }

    @GetMapping("/search")
    public Page<PatientResponse> search(@RequestParam(required = false) String name,
                                        @RequestParam(required = false) String email,
                                        @RequestParam(required = false) String phone,
                                        @RequestParam(required = false, name = "code") String code,
                                        @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate dobFrom,
                                        @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate dobTo,
                                        @RequestParam(required = false) Boolean active,
                                        @RequestParam(required = false) com.clinic.patientservice.model.PatientStatus status,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size) {
        return patientService.search(name, email, phone, code, dobFrom, dobTo, active, status, page, size)
                .map(PatientController::toDto);
    }

    @GetMapping("/{id}")
    public PatientResponse get(@PathVariable Long id) {
        return toDto(patientService.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PatientResponse create(@Valid @RequestBody CreatePatientRequest req) {
        return toDto(patientService.create(req));
    }

    @PutMapping("/{id}")
    public PatientResponse update(@PathVariable Long id, @Valid @RequestBody UpdatePatientRequest req) {
        return toDto(patientService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        patientService.delete(id);
    }

    private static PatientResponse toDto(Patient p) {
        PatientResponse r = new PatientResponse();
        r.id = p.getId();
        r.patientCode = p.getPatientCode();
        r.firstName = p.getFirstName();
        r.lastName = p.getLastName();
        r.email = p.getEmail();
        r.phone = p.getPhone();
        r.dateOfBirth = p.getDateOfBirth();
        r.gender = p.getGender();
        r.addressLine = p.getAddressLine();
        r.city = p.getCity();
        r.state = p.getState();
        r.postalCode = p.getPostalCode();
        r.country = p.getCountry();
        r.active = p.isActive();
        r.status = p.getStatus();
        r.createdAt = p.getCreatedAt();
        r.updatedAt = p.getUpdatedAt();
        return r;
    }
}
