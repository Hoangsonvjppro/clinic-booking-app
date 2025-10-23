package com.clinic.doctorservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Doctor extends User {

    private String doctorName;

    private String workAddress;

    private String specialization;  // what they specialize in
}
