package com.clinic.doctorservice.repository;


import com.clinic.doctorservice.model.Doctor;
import com.clinic.doctorservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public class UserRepository {
    User findByEmail(String email);
}

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
