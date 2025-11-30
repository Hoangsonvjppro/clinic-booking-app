-- Add Health Profiles table for Patient Service
-- This table has a one-to-one relationship with patients

CREATE TABLE health_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL UNIQUE, -- One-to-one relationship with patients
    blood_type VARCHAR(10), -- e.g., 'A+', 'B-', 'O+', 'AB-'
    allergies JSONB, -- Store as JSON array, e.g., ["Penicillin", "Peanuts"]
    medical_history TEXT, -- Background diseases and conditions
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint to patients table (same database)
    CONSTRAINT fk_health_profiles_patient 
        FOREIGN KEY (patient_id) 
        REFERENCES patients(id) 
        ON DELETE CASCADE
);

-- Index for FK lookup
CREATE INDEX idx_health_profiles_patient ON health_profiles(patient_id);

-- Comments for documentation
COMMENT ON TABLE health_profiles IS 'Stores detailed health information for patients';
COMMENT ON COLUMN health_profiles.patient_id IS 'One-to-one reference to patients table';
COMMENT ON COLUMN health_profiles.allergies IS 'JSON array of known allergies';
COMMENT ON COLUMN health_profiles.medical_history IS 'Past medical conditions, surgeries, and chronic diseases';
