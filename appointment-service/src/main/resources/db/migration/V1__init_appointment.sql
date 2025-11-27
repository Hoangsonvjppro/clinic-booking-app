-- Enable PostgreSQL UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Appointment Status lookup table
CREATE TABLE appointment_status (
    id SERIAL PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    display_name VARCHAR(64) NOT NULL
);

-- Insert default appointment statuses
INSERT INTO appointment_status (code, display_name) VALUES
('PENDING', 'Pending'),
('CONFIRMED', 'Confirmed'),
('CANCELLED', 'Cancelled'),
('COMPLETED', 'Completed');

-- Appointments table with UUID primary key
CREATE TABLE appointments (
    appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    appointment_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status_id INTEGER NOT NULL REFERENCES appointment_status(id),
    notes TEXT,
    cancelled_reason TEXT,
    -- Snapshot fields for display without external calls
    doctor_name VARCHAR(255),
    patient_name VARCHAR(255),
    clinic_address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_time ON appointments(appointment_time);
CREATE INDEX idx_appointments_status ON appointments(status_id);
