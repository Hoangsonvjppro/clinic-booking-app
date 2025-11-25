CREATE TABLE IF NOT EXISTS appointment_status (
    id SERIAL PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    display_name VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    appointment_id UUID PRIMARY KEY,
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    appointment_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    cancelled_reason TEXT,
    doctor_name VARCHAR(255),
    patient_name VARCHAR(255),
    clinic_address TEXT
);

CREATE TABLE IF NOT EXISTS appointment_audit (
    audit_id SERIAL PRIMARY KEY,
    appointment_id UUID NOT NULL REFERENCES appointments (appointment_id),
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
