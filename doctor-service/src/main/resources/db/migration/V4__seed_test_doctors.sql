-- Seed specialties (chuyên khoa)
INSERT INTO specialties (name, code) VALUES
  ('Tim mạch', 'CARDIOLOGY'),
  ('Da liễu', 'DERMATOLOGY'),
  ('Thần kinh', 'NEUROLOGY'),
  ('Nhi khoa', 'PEDIATRICS'),
  ('Chấn thương chỉnh hình', 'ORTHOPEDICS'),
  ('Nhãn khoa', 'OPHTHALMOLOGY'),
  ('Tai mũi họng', 'ENT'),
  ('Tiêu hóa', 'GASTROENTEROLOGY'),
  ('Tâm thần', 'PSYCHIATRY'),
  ('Đa khoa', 'GENERAL')
ON CONFLICT (code) DO NOTHING;

-- Seed doctors (links to auth-service users)
INSERT INTO doctor (id, user_id, full_name, phone, hospital_name, hospital_address, auto_accept_patients, payment_method, status, consultation_fee, bio, experience_years, created_at)
VALUES
  -- Cardiologist
  ('d1000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 
   'BS. Nguyễn Văn An', '0901000001', 'Bệnh viện Tim mạch TP.HCM', '123 Nguyễn Thị Minh Khai, Q.1, TP.HCM',
   true, 'BOTH', 'APPROVED', 500000, 
   'Bác sĩ chuyên khoa Tim mạch với hơn 15 năm kinh nghiệm. Chuyên điều trị các bệnh về tim, huyết áp, rối loạn nhịp tim.',
   15, NOW()),
   
  -- Dermatologist
  ('d1000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002',
   'BS. Trần Thị Bình', '0901000002', 'Bệnh viện Da liễu TP.HCM', '2 Nguyễn Thông, Q.3, TP.HCM',
   true, 'CASH', 'APPROVED', 400000,
   'Chuyên gia da liễu với nhiều năm kinh nghiệm. Điều trị mụn, nám, tàn nhang, các bệnh da liễu mãn tính.',
   12, NOW()),
   
  -- Neurologist
  ('d1000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000003',
   'BS. Lê Văn Cường', '0901000003', 'Bệnh viện Chợ Rẫy', '201B Nguyễn Chí Thanh, Q.5, TP.HCM',
   false, 'BOTH', 'APPROVED', 600000,
   'Bác sĩ thần kinh chuyên sâu về các bệnh đau đầu, đột quỵ, Parkinson, động kinh.',
   20, NOW()),
   
  -- Pediatrician
  ('d1000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000004',
   'BS. Phạm Thị Dung', '0901000004', 'Bệnh viện Nhi Đồng 1', '341 Sư Vạn Hạnh, Q.10, TP.HCM',
   true, 'CASH', 'APPROVED', 350000,
   'Bác sĩ nhi khoa yêu trẻ, tận tâm. Chăm sóc sức khỏe trẻ em từ sơ sinh đến 16 tuổi.',
   10, NOW()),
   
  -- Orthopedist
  ('d1000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000005',
   'BS. Hoàng Văn Em', '0901000005', 'Bệnh viện Chấn thương Chỉnh hình', '929 Trần Hưng Đạo, Q.5, TP.HCM',
   true, 'BOTH', 'APPROVED', 450000,
   'Chuyên gia về xương khớp, chấn thương thể thao, phẫu thuật nội soi khớp.',
   18, NOW()),
   
  -- Ophthalmologist
  ('d1000001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000006',
   'BS. Ngô Thị Phượng', '0901000006', 'Bệnh viện Mắt TP.HCM', '1 Điện Biên Phủ, Q.3, TP.HCM',
   true, 'CASH', 'APPROVED', 400000,
   'Bác sĩ nhãn khoa chuyên điều trị các bệnh về mắt: cận thị, viễn thị, đục thủy tinh thể, tăng nhãn áp.',
   14, NOW()),
   
  -- ENT Specialist
  ('d1000001-0000-0000-0000-000000000007', 'd0000001-0000-0000-0000-000000000007',
   'BS. Vũ Văn Giang', '0901000007', 'Bệnh viện Tai Mũi Họng', '155B Trần Quốc Thảo, Q.3, TP.HCM',
   false, 'BOTH', 'APPROVED', 380000,
   'Chuyên gia tai mũi họng. Điều trị viêm xoang, viêm họng, rối loạn thính giác.',
   11, NOW()),
   
  -- Gastroenterologist
  ('d1000001-0000-0000-0000-000000000008', 'd0000001-0000-0000-0000-000000000008',
   'BS. Đặng Thị Hoa', '0901000008', 'Bệnh viện Bình Dân', '371 Điện Biên Phủ, Q.3, TP.HCM',
   true, 'CASH', 'APPROVED', 500000,
   'Bác sĩ tiêu hóa với chuyên môn cao. Nội soi dạ dày, đại tràng, điều trị các bệnh đường tiêu hóa.',
   16, NOW()),
   
  -- Psychiatrist
  ('d1000001-0000-0000-0000-000000000009', 'd0000001-0000-0000-0000-000000000009',
   'BS. Bùi Văn Khoa', '0901000009', 'Bệnh viện Tâm thần TP.HCM', '1 Trần Cao Vân, Q.3, TP.HCM',
   true, 'BOTH', 'APPROVED', 450000,
   'Bác sĩ tâm thần kinh. Điều trị trầm cảm, lo âu, rối loạn giấc ngủ, stress.',
   13, NOW()),
   
  -- General Practitioner
  ('d1000001-0000-0000-0000-000000000010', 'd0000001-0000-0000-0000-000000000010',
   'BS. Mai Thị Lan', '0901000010', 'Phòng khám Đa khoa Sài Gòn', '12 Lý Tự Trọng, Q.1, TP.HCM',
   true, 'CASH', 'APPROVED', 300000,
   'Bác sĩ đa khoa tận tình, thân thiện. Khám tổng quát, tư vấn sức khỏe, khám bệnh thông thường.',
   8, NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Link doctors to specialties
INSERT INTO doctor_specialties (doctor_id, specialty_id)
SELECT d.id, s.id FROM doctor d, specialties s WHERE d.user_id = 'd0000001-0000-0000-0000-000000000001'::uuid AND s.code = 'CARDIOLOGY'
ON CONFLICT DO NOTHING;

INSERT INTO doctor_specialties (doctor_id, specialty_id)
SELECT d.id, s.id FROM doctor d, specialties s WHERE d.user_id = 'd0000001-0000-0000-0000-000000000002'::uuid AND s.code = 'DERMATOLOGY'
ON CONFLICT DO NOTHING;

INSERT INTO doctor_specialties (doctor_id, specialty_id)
SELECT d.id, s.id FROM doctor d, specialties s WHERE d.user_id = 'd0000001-0000-0000-0000-000000000003'::uuid AND s.code = 'NEUROLOGY'
ON CONFLICT DO NOTHING;

INSERT INTO doctor_specialties (doctor_id, specialty_id)
SELECT d.id, s.id FROM doctor d, specialties s WHERE d.user_id = 'd0000001-0000-0000-0000-000000000004'::uuid AND s.code = 'PEDIATRICS'
ON CONFLICT DO NOTHING;

INSERT INTO doctor_specialties (doctor_id, specialty_id)
SELECT d.id, s.id FROM doctor d, specialties s WHERE d.user_id = 'd0000001-0000-0000-0000-000000000005'::uuid AND s.code = 'ORTHOPEDICS'
ON CONFLICT DO NOTHING;

INSERT INTO doctor_specialties (doctor_id, specialty_id)
SELECT d.id, s.id FROM doctor d, specialties s WHERE d.user_id = 'd0000001-0000-0000-0000-000000000006'::uuid AND s.code = 'OPHTHALMOLOGY'
ON CONFLICT DO NOTHING;

INSERT INTO doctor_specialties (doctor_id, specialty_id)
SELECT d.id, s.id FROM doctor d, specialties s WHERE d.user_id = 'd0000001-0000-0000-0000-000000000007'::uuid AND s.code = 'ENT'
ON CONFLICT DO NOTHING;

INSERT INTO doctor_specialties (doctor_id, specialty_id)
SELECT d.id, s.id FROM doctor d, specialties s WHERE d.user_id = 'd0000001-0000-0000-0000-000000000008'::uuid AND s.code = 'GASTROENTEROLOGY'
ON CONFLICT DO NOTHING;

INSERT INTO doctor_specialties (doctor_id, specialty_id)
SELECT d.id, s.id FROM doctor d, specialties s WHERE d.user_id = 'd0000001-0000-0000-0000-000000000009'::uuid AND s.code = 'PSYCHIATRY'
ON CONFLICT DO NOTHING;

INSERT INTO doctor_specialties (doctor_id, specialty_id)
SELECT d.id, s.id FROM doctor d, specialties s WHERE d.user_id = 'd0000001-0000-0000-0000-000000000010'::uuid AND s.code = 'GENERAL'
ON CONFLICT DO NOTHING;
