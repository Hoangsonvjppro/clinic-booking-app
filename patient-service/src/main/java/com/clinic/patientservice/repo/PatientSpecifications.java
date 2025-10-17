package com.clinic.patientservice.repo;

import com.clinic.patientservice.model.Patient;
import com.clinic.patientservice.model.PatientStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class PatientSpecifications {
    private PatientSpecifications() {}

    public static Specification<Patient> nameContains(String name) {
        if (name == null || name.isBlank()) return null;
        String like = "%" + name.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("firstName")), like),
                cb.like(cb.lower(root.get("lastName")), like)
        );
    }

    public static Specification<Patient> emailEquals(String email) {
        if (email == null || email.isBlank()) return null;
        String em = email.toLowerCase();
        return (root, query, cb) -> cb.equal(cb.lower(root.get("email")), em);
    }

    public static Specification<Patient> phoneEquals(String phone) {
        if (phone == null || phone.isBlank()) return null;
        return (root, query, cb) -> cb.equal(root.get("phone"), phone);
    }

    public static Specification<Patient> codeEquals(String code) {
        if (code == null || code.isBlank()) return null;
        String c = code.toUpperCase();
        return (root, query, cb) -> cb.equal(cb.upper(root.get("patientCode")), c);
    }

    public static Specification<Patient> dobFrom(LocalDate from) {
        if (from == null) return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("dateOfBirth"), from);
    }

    public static Specification<Patient> dobTo(LocalDate to) {
        if (to == null) return null;
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("dateOfBirth"), to);
    }

    public static Specification<Patient> activeEquals(Boolean active) {
        if (active == null) return null;
        return (root, query, cb) -> cb.equal(root.get("active"), active);
    }

    public static Specification<Patient> statusEquals(PatientStatus status) {
        if (status == null) return null;
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }
}
