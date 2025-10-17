-- Add active and status columns for patient contract
ALTER TABLE patients ADD COLUMN IF NOT EXISTS is_active BOOLEAN;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS status VARCHAR(32);

-- Backfill defaults
UPDATE patients SET is_active = COALESCE(is_active, true);
UPDATE patients SET status = COALESCE(status, 'ACTIVE');

-- Enforce not null
ALTER TABLE patients ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE patients ALTER COLUMN status SET NOT NULL;

-- Optional index to filter by status
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);

