-- Seed data for testing 3-party system
-- Password for all test accounts: Test@123 (BCrypt encoded)
-- BCrypt hash: $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu

-- =============================================
-- ADMIN ACCOUNTS (2)
-- =============================================

INSERT INTO users (id, email, password_hash, full_name, phone, enabled, email_verified_at, created_at, updated_at)
VALUES 
  ('a0000001-0000-0000-0000-000000000001', 'admin1@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'Super Admin', '0900000001', true, NOW(), NOW(), NOW()),
  ('a0000001-0000-0000-0000-000000000002', 'admin2@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'System Admin', '0900000002', true, NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Assign ADMIN role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email IN ('admin1@clinic.com', 'admin2@clinic.com') AND r.code = 'ADMIN'
ON CONFLICT DO NOTHING;

-- =============================================
-- DOCTOR ACCOUNTS (10 - various specialties)
-- =============================================

INSERT INTO users (id, email, password_hash, full_name, phone, enabled, email_verified_at, created_at, updated_at)
VALUES 
  -- Cardiologist
  ('d0000001-0000-0000-0000-000000000001', 'doctor.cardio@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'BS. Nguyễn Văn An', '0901000001', true, NOW(), NOW(), NOW()),
  -- Dermatologist  
  ('d0000001-0000-0000-0000-000000000002', 'doctor.derma@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'BS. Trần Thị Bình', '0901000002', true, NOW(), NOW(), NOW()),
  -- Neurologist
  ('d0000001-0000-0000-0000-000000000003', 'doctor.neuro@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'BS. Lê Văn Cường', '0901000003', true, NOW(), NOW(), NOW()),
  -- Pediatrician
  ('d0000001-0000-0000-0000-000000000004', 'doctor.pedia@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'BS. Phạm Thị Dung', '0901000004', true, NOW(), NOW(), NOW()),
  -- Orthopedist
  ('d0000001-0000-0000-0000-000000000005', 'doctor.ortho@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'BS. Hoàng Văn Em', '0901000005', true, NOW(), NOW(), NOW()),
  -- Ophthalmologist
  ('d0000001-0000-0000-0000-000000000006', 'doctor.eye@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'BS. Ngô Thị Phượng', '0901000006', true, NOW(), NOW(), NOW()),
  -- ENT Specialist
  ('d0000001-0000-0000-0000-000000000007', 'doctor.ent@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'BS. Vũ Văn Giang', '0901000007', true, NOW(), NOW(), NOW()),
  -- Gastroenterologist
  ('d0000001-0000-0000-0000-000000000008', 'doctor.gastro@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'BS. Đặng Thị Hoa', '0901000008', true, NOW(), NOW(), NOW()),
  -- Psychiatrist
  ('d0000001-0000-0000-0000-000000000009', 'doctor.psych@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'BS. Bùi Văn Khoa', '0901000009', true, NOW(), NOW(), NOW()),
  -- General Practitioner
  ('d0000001-0000-0000-0000-000000000010', 'doctor.general@clinic.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'BS. Mai Thị Lan', '0901000010', true, NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Assign DOCTOR role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email LIKE 'doctor.%@clinic.com' AND r.code = 'DOCTOR'
ON CONFLICT DO NOTHING;

-- =============================================
-- PATIENT ACCOUNTS (10)
-- =============================================

INSERT INTO users (id, email, password_hash, full_name, phone, enabled, email_verified_at, created_at, updated_at)
VALUES 
  ('p0000001-0000-0000-0000-000000000001', 'patient1@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'Nguyễn Minh Tuấn', '0902000001', true, NOW(), NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000002', 'patient2@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'Trần Thị Hương', '0902000002', true, NOW(), NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000003', 'patient3@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'Lê Văn Nam', '0902000003', true, NOW(), NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000004', 'patient4@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'Phạm Thị Ngọc', '0902000004', true, NOW(), NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000005', 'patient5@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'Hoàng Văn Phong', '0902000005', true, NOW(), NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000006', 'patient6@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'Ngô Thị Quỳnh', '0902000006', true, NOW(), NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000007', 'patient7@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'Vũ Văn Sơn', '0902000007', true, NOW(), NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000008', 'patient8@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'Đặng Thị Thảo', '0902000008', true, NOW(), NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000009', 'patient9@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'Bùi Văn Uy', '0902000009', true, NOW(), NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000010', 'patient10@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubAcu', 'Mai Thị Vân', '0902000010', true, NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Assign PATIENT role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email LIKE 'patient%@gmail.com' AND r.code = 'PATIENT'
ON CONFLICT DO NOTHING;

-- Set account_status to ACTIVE for all seed users
UPDATE users SET account_status = 'ACTIVE' 
WHERE email IN (
  'admin1@clinic.com', 'admin2@clinic.com',
  'doctor.cardio@clinic.com', 'doctor.derma@clinic.com', 'doctor.neuro@clinic.com',
  'doctor.pedia@clinic.com', 'doctor.ortho@clinic.com', 'doctor.eye@clinic.com',
  'doctor.ent@clinic.com', 'doctor.gastro@clinic.com', 'doctor.psych@clinic.com',
  'doctor.general@clinic.com',
  'patient1@gmail.com', 'patient2@gmail.com', 'patient3@gmail.com',
  'patient4@gmail.com', 'patient5@gmail.com', 'patient6@gmail.com',
  'patient7@gmail.com', 'patient8@gmail.com', 'patient9@gmail.com',
  'patient10@gmail.com'
);
