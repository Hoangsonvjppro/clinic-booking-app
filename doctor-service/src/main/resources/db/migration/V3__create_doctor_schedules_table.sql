CREATE TABLE doctor_schedules (
    id BIGSERIAL PRIMARY KEY,
    doctor_id UUID NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_doctor_schedules_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);
