-- Add fee columns to doctor_applications table
ALTER TABLE doctor_applications ADD COLUMN IF NOT EXISTS consultation_fee DECIMAL(12,2) DEFAULT 300000;
ALTER TABLE doctor_applications ADD COLUMN IF NOT EXISTS follow_up_fee DECIMAL(12,2) DEFAULT 200000;
ALTER TABLE doctor_applications ADD COLUMN IF NOT EXISTS emergency_fee DECIMAL(12,2) DEFAULT 500000;
ALTER TABLE doctor_applications ADD COLUMN IF NOT EXISTS consultation_duration INTEGER DEFAULT 30;

COMMENT ON COLUMN doctor_applications.consultation_fee IS 'Base consultation fee in VND';
COMMENT ON COLUMN doctor_applications.follow_up_fee IS 'Follow-up consultation fee in VND';
COMMENT ON COLUMN doctor_applications.emergency_fee IS 'Emergency consultation fee in VND';
COMMENT ON COLUMN doctor_applications.consultation_duration IS 'Default consultation duration in minutes';
