-- Seed patients (links to auth-service users)
INSERT INTO patients (id, first_name, last_name, email, phone, date_of_birth, gender, address_line, city, state, postal_code, country, created_at, updated_at)
VALUES
  ('p0000001-0000-0000-0000-000000000001', 'Minh Tuấn', 'Nguyễn', 'patient1@gmail.com', '0902000001',
   '1990-05-15', 'MALE', '123 Nguyễn Huệ', 'TP. Hồ Chí Minh', 'Quận 1', '700000', 'Vietnam', NOW(), NOW()),
   
  ('p0000001-0000-0000-0000-000000000002', 'Thị Hương', 'Trần', 'patient2@gmail.com', '0902000002',
   '1988-08-22', 'FEMALE', '456 Lê Lợi', 'TP. Hồ Chí Minh', 'Quận 3', '700000', 'Vietnam', NOW(), NOW()),
   
  ('p0000001-0000-0000-0000-000000000003', 'Văn Nam', 'Lê', 'patient3@gmail.com', '0902000003',
   '1995-03-10', 'MALE', '789 Trần Hưng Đạo', 'TP. Hồ Chí Minh', 'Quận 5', '700000', 'Vietnam', NOW(), NOW()),
   
  ('p0000001-0000-0000-0000-000000000004', 'Thị Ngọc', 'Phạm', 'patient4@gmail.com', '0902000004',
   '1992-12-01', 'FEMALE', '321 Võ Văn Tần', 'TP. Hồ Chí Minh', 'Quận 3', '700000', 'Vietnam', NOW(), NOW()),
   
  ('p0000001-0000-0000-0000-000000000005', 'Văn Phong', 'Hoàng', 'patient5@gmail.com', '0902000005',
   '1985-07-20', 'MALE', '654 Cách Mạng Tháng 8', 'TP. Hồ Chí Minh', 'Quận 10', '700000', 'Vietnam', NOW(), NOW()),
   
  ('p0000001-0000-0000-0000-000000000006', 'Thị Quỳnh', 'Ngô', 'patient6@gmail.com', '0902000006',
   '1998-11-08', 'FEMALE', '987 Điện Biên Phủ', 'TP. Hồ Chí Minh', 'Quận Bình Thạnh', '700000', 'Vietnam', NOW(), NOW()),
   
  ('p0000001-0000-0000-0000-000000000007', 'Văn Sơn', 'Vũ', 'patient7@gmail.com', '0902000007',
   '1982-04-25', 'MALE', '147 Nguyễn Văn Cừ', 'TP. Hồ Chí Minh', 'Quận 5', '700000', 'Vietnam', NOW(), NOW()),
   
  ('p0000001-0000-0000-0000-000000000008', 'Thị Thảo', 'Đặng', 'patient8@gmail.com', '0902000008',
   '2000-09-12', 'FEMALE', '258 Hai Bà Trưng', 'TP. Hồ Chí Minh', 'Quận 1', '700000', 'Vietnam', NOW(), NOW()),
   
  ('p0000001-0000-0000-0000-000000000009', 'Văn Uy', 'Bùi', 'patient9@gmail.com', '0902000009',
   '1975-06-30', 'MALE', '369 Lý Thường Kiệt', 'TP. Hồ Chí Minh', 'Quận 10', '700000', 'Vietnam', NOW(), NOW()),
   
  ('p0000001-0000-0000-0000-000000000010', 'Thị Vân', 'Mai', 'patient10@gmail.com', '0902000010',
   '1993-02-14', 'FEMALE', '741 Phan Đình Phùng', 'TP. Hồ Chí Minh', 'Quận Phú Nhuận', '700000', 'Vietnam', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
