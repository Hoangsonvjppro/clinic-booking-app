INSERT INTO roles(code, display_name, description) VALUES
  ('ADMIN','Administrator','System admin'),
  ('USER','User','Basic authenticated user'),
  ('DOCTOR','Doctor','Medical doctor'),
  ('NURSE','Nurse','Medical nurse'),
  ('RECEPTIONIST','Receptionist','Front desk staff'),
  ('PATIENT','Patient','Clinic patient')
ON CONFLICT (code) DO NOTHING;
