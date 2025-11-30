-- Add Medical Records table for Appointment Service
-- This table stores examination results linked to appointments

CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE, -- One-to-one relationship with appointments
    diagnosis TEXT NOT NULL, -- Doctor's diagnosis/conclusion
    prescription JSONB, -- Store as JSON array of medicines with dosage, e.g., [{"name": "Paracetamol", "dosage": "500mg", "frequency": "twice daily"}]
    doctor_notes TEXT, -- Additional notes from doctor
    attachments TEXT[], -- PostgreSQL array of URLs for X-Ray/Ultrasound images
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint to appointments table (same database)
    CONSTRAINT fk_medical_records_appointment 
        FOREIGN KEY (appointment_id) 
        REFERENCES appointments(appointment_id) 
        ON DELETE CASCADE
);

-- Index for FK lookup
CREATE INDEX idx_medical_records_appointment ON medical_records(appointment_id);
CREATE INDEX idx_medical_records_created_at ON medical_records(created_at);

-- Comments for documentation
COMMENT ON TABLE medical_records IS 'Stores medical examination results and prescriptions for completed appointments';
COMMENT ON COLUMN medical_records.appointment_id IS 'One-to-one reference to appointments table';
COMMENT ON COLUMN medical_records.prescription IS 'JSON array containing prescribed medications with dosage instructions';
COMMENT ON COLUMN medical_records.attachments IS 'Array of file URLs (X-rays, ultrasound, lab results, etc.)';
