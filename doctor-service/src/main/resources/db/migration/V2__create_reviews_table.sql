CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    doctor_id UUID NOT NULL,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT NOT NULL UNIQUE,
    rating DOUBLE PRECISION NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_reviews_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);
