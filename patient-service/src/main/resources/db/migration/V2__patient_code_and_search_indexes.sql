-- Add patient_code and helpful search indexes
ALTER TABLE patients ADD COLUMN IF NOT EXISTS patient_code VARCHAR(32);

-- Backfill existing rows with deterministic code based on id
UPDATE patients SET patient_code = 'PT' || lpad(id::text, 8, '0') WHERE patient_code IS NULL OR patient_code = '';

-- Enforce NOT NULL and uniqueness
ALTER TABLE patients ALTER COLUMN patient_code SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_patients_patient_code ON patients(patient_code);

-- Optional indexes for searching
CREATE INDEX IF NOT EXISTS idx_patients_first_name_lower ON patients (lower(first_name));
CREATE INDEX IF NOT EXISTS idx_patients_last_name_lower ON patients (lower(last_name));
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients (phone);

