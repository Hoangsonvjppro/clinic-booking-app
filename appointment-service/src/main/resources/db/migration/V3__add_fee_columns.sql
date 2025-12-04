-- Add fee columns to appointments table for storing actual fees at booking time
ALTER TABLE appointments ADD COLUMN consultation_fee DECIMAL(12,2) DEFAULT 0;
ALTER TABLE appointments ADD COLUMN service_fee DECIMAL(12,2) DEFAULT 0;
ALTER TABLE appointments ADD COLUMN total_amount DECIMAL(12,2) DEFAULT 0;

-- Add index for fee queries
CREATE INDEX idx_appointments_total_amount ON appointments(total_amount);

COMMENT ON COLUMN appointments.consultation_fee IS 'Doctor consultation fee at time of booking (VND)';
COMMENT ON COLUMN appointments.service_fee IS 'Platform service fee/commission at time of booking (VND)';
COMMENT ON COLUMN appointments.total_amount IS 'Total amount = consultation_fee + service_fee';
