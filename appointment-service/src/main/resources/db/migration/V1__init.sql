CREATE TABLE IF NOT EXISTS appointment_status (
    id SERIAL PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    display_name VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    status_id BIGINT NOT NULL REFERENCES appointment_status (id),
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    cancelled_reason TEXT,
    CONSTRAINT uk_appointments_doctor_time UNIQUE (doctor_id, appointment_time)
);

CREATE TABLE IF NOT EXISTS appointment_audit (
    audit_id SERIAL PRIMARY KEY,
    appointment_id BIGINT NOT NULL REFERENCES appointments (appointment_id),
    action VARCHAR(32) NOT NULL,
    performed_by VARCHAR(64) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

INSERT INTO appointment_status (code, display_name) VALUES
    ('PENDING', 'Pending Confirmation'),
    ('CONFIRMED', 'Confirmed'),
    ('CANCELLED', 'Cancelled'),
    ('COMPLETED', 'Completed')
ON CONFLICT (code) DO NOTHING;
