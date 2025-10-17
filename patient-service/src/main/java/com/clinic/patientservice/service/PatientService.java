package com.clinic.patientservice.service;

import com.clinic.patientservice.exception.ResourceNotFoundException;
import com.clinic.patientservice.model.Patient;
import com.clinic.patientservice.repo.PatientRepository;
import com.clinic.patientservice.repo.PatientSpecifications;
import com.clinic.patientservice.web.dto.CreatePatientRequest;
import com.clinic.patientservice.web.dto.UpdatePatientRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.domain.Specification;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Transactional(readOnly = true)
    public Page<Patient> list(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100));
        return patientRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Patient> search(String name, String email, String phone, String code,
                                java.time.LocalDate dobFrom, java.time.LocalDate dobTo,
                                Boolean active, com.clinic.patientservice.model.PatientStatus status,
                                int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100));
        var spec = Specification.where(PatientSpecifications.nameContains(name))
                .and(PatientSpecifications.emailEquals(email))
                .and(PatientSpecifications.phoneEquals(phone))
                .and(PatientSpecifications.codeEquals(code))
                .and(PatientSpecifications.dobFrom(dobFrom))
                .and(PatientSpecifications.dobTo(dobTo))
                .and(PatientSpecifications.activeEquals(active))
                .and(PatientSpecifications.statusEquals(status));
        return patientRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Patient get(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + id));
    }

    @Transactional
    public Patient create(CreatePatientRequest req) {
        if (patientRepository.existsByEmail(req.email)) {
            throw new IllegalArgumentException("Email already exists: " + req.email);
        }
        Patient p = new Patient();
        apply(p, req);
        p.setPatientCode(generateUniqueCode());
        if (req.active != null) p.setActive(req.active);
        if (req.status != null) p.setStatus(req.status);
        return patientRepository.save(p);
    }

    @Transactional
    public Patient update(Long id, UpdatePatientRequest req) {
        Patient p = get(id);
        // if email changed, check uniqueness
        if (!p.getEmail().equals(req.email) && patientRepository.existsByEmail(req.email)) {
            throw new IllegalArgumentException("Email already exists: " + req.email);
        }
        apply(p, req);
        if (req.active != null) p.setActive(req.active);
        if (req.status != null) p.setStatus(req.status);
        return patientRepository.save(p);
    }

    @Transactional
    public void delete(Long id) {
        Patient p = get(id);
        patientRepository.delete(p);
    }

    private static void apply(Patient p, CreatePatientRequest req) {
        p.setFirstName(req.firstName);
        p.setLastName(req.lastName);
        p.setEmail(req.email);
        p.setPhone(req.phone);
        p.setDateOfBirth(req.dateOfBirth);
        p.setGender(req.gender);
        p.setAddressLine(req.addressLine);
        p.setCity(req.city);
        p.setState(req.state);
        p.setPostalCode(req.postalCode);
        p.setCountry(req.country);
    }

    private static void apply(Patient p, UpdatePatientRequest req) {
        p.setFirstName(req.firstName);
        p.setLastName(req.lastName);
        p.setEmail(req.email);
        p.setPhone(req.phone);
        p.setDateOfBirth(req.dateOfBirth);
        p.setGender(req.gender);
        p.setAddressLine(req.addressLine);
        p.setCity(req.city);
        p.setState(req.state);
        p.setPostalCode(req.postalCode);
        p.setCountry(req.country);
    }

    private String generateUniqueCode() {
        for (int i = 0; i < 5; i++) {
            String code = "PT" + (System.currentTimeMillis() / 1000) + String.format("%03d", (int)(Math.random()*1000));
            if (!patientRepository.existsByPatientCode(code)) {
                return code;
            }
            try { Thread.sleep(5L); } catch (InterruptedException ignored) {}
        }
        return "PT" + System.nanoTime();
    }
}
