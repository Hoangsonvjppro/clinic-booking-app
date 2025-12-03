# 🧪 Test Accounts - Clinic Booking App

> **Mật khẩu chung cho tất cả tài khoản:** `Test@123`

---

## 👨‍💼 ADMIN ACCOUNTS (2)

| Email | Tên | Phone | Mục đích |
|-------|-----|-------|----------|
| `admin1@clinic.com` | Super Admin | 0900000001 | Quản trị viên cấp cao |
| `admin2@clinic.com` | System Admin | 0900000002 | Quản trị viên hệ thống |

---

## 👨‍⚕️ DOCTOR ACCOUNTS (10)

| Email | Tên | Chuyên khoa | Bệnh viện | Phí khám |
|-------|-----|-------------|-----------|----------|
| `doctor.cardio@clinic.com` | BS. Nguyễn Văn An | Tim mạch | BV Tim mạch TP.HCM | 500,000đ |
| `doctor.derma@clinic.com` | BS. Trần Thị Bình | Da liễu | BV Da liễu TP.HCM | 400,000đ |
| `doctor.neuro@clinic.com` | BS. Lê Văn Cường | Thần kinh | BV Chợ Rẫy | 600,000đ |
| `doctor.pedia@clinic.com` | BS. Phạm Thị Dung | Nhi khoa | BV Nhi Đồng 1 | 350,000đ |
| `doctor.ortho@clinic.com` | BS. Hoàng Văn Em | Chấn thương chỉnh hình | BV CTCH | 450,000đ |
| `doctor.eye@clinic.com` | BS. Ngô Thị Phượng | Nhãn khoa | BV Mắt TP.HCM | 400,000đ |
| `doctor.ent@clinic.com` | BS. Vũ Văn Giang | Tai mũi họng | BV Tai Mũi Họng | 380,000đ |
| `doctor.gastro@clinic.com` | BS. Đặng Thị Hoa | Tiêu hóa | BV Bình Dân | 500,000đ |
| `doctor.psych@clinic.com` | BS. Bùi Văn Khoa | Tâm thần | BV Tâm thần TP.HCM | 450,000đ |
| `doctor.general@clinic.com` | BS. Mai Thị Lan | Đa khoa | PK Đa khoa Sài Gòn | 300,000đ |

---

## 👤 PATIENT ACCOUNTS (10)

| Email | Tên | Phone | Năm sinh | Giới tính |
|-------|-----|-------|----------|-----------|
| `patient1@gmail.com` | Nguyễn Minh Tuấn | 0902000001 | 1990 | Nam |
| `patient2@gmail.com` | Trần Thị Hương | 0902000002 | 1988 | Nữ |
| `patient3@gmail.com` | Lê Văn Nam | 0902000003 | 1995 | Nam |
| `patient4@gmail.com` | Phạm Thị Ngọc | 0902000004 | 1992 | Nữ |
| `patient5@gmail.com` | Hoàng Văn Phong | 0902000005 | 1985 | Nam |
| `patient6@gmail.com` | Ngô Thị Quỳnh | 0902000006 | 1998 | Nữ |
| `patient7@gmail.com` | Vũ Văn Sơn | 0902000007 | 1982 | Nam |
| `patient8@gmail.com` | Đặng Thị Thảo | 0902000008 | 2000 | Nữ |
| `patient9@gmail.com` | Bùi Văn Uy | 0902000009 | 1975 | Nam |
| `patient10@gmail.com` | Mai Thị Vân | 0902000010 | 1993 | Nữ |

---

## 🔧 Cách sử dụng

### 1. Reset database và áp dụng seed data
```bash
cd docker
./reset-all.ps1
./start-all.ps1
```

### 2. Hoặc chỉ reset từng service
```bash
# Auth service
docker-compose down -v auth-db
docker-compose up -d auth-db

# Doctor service
docker-compose down -v doctor-db
docker-compose up -d doctor-db

# Patient service
docker-compose down -v patient-db
docker-compose up -d patient-db
```

### 3. Đăng nhập
- Truy cập: http://localhost:3000
- Sử dụng email + mật khẩu `Test@123`

---

## 📝 Test Cases với các tài khoản

### Test 1: Patient báo cáo Doctor
1. Login với `patient1@gmail.com`
2. Tạo báo cáo về `doctor.cardio@clinic.com` 
3. Login với `admin1@clinic.com`
4. Xem báo cáo và xử lý

### Test 2: Doctor báo cáo Patient no-show
1. Login với `doctor.derma@clinic.com`
2. Tạo báo cáo no-show về `patient2@gmail.com`
3. Login với `admin1@clinic.com`
4. Xử lý báo cáo và áp dụng phí phạt

### Test 3: Admin quản lý user
1. Login với `admin1@clinic.com`
2. Vào trang User Management
3. Thay đổi status của một patient thành WARNED
4. Kiểm tra patient đó nhận được warning

### Test 4: Áp dụng penalty
1. Login với `admin2@clinic.com`
2. Vào trang Penalty Management
3. Áp dụng DOUBLE_BOOKING_FEE cho một patient
4. Patient đó sẽ phải trả phí gấp đôi khi đặt lịch

---

## 🗄️ Database UUIDs

### Admin UUIDs
- admin1: `a0000001-0000-0000-0000-000000000001`
- admin2: `a0000001-0000-0000-0000-000000000002`

### Doctor UUIDs (auth-service user_id)
- cardio: `d0000001-0000-0000-0000-000000000001`
- derma: `d0000001-0000-0000-0000-000000000002`
- neuro: `d0000001-0000-0000-0000-000000000003`
- pedia: `d0000001-0000-0000-0000-000000000004`
- ortho: `d0000001-0000-0000-0000-000000000005`
- eye: `d0000001-0000-0000-0000-000000000006`
- ent: `d0000001-0000-0000-0000-000000000007`
- gastro: `d0000001-0000-0000-0000-000000000008`
- psych: `d0000001-0000-0000-0000-000000000009`
- general: `d0000001-0000-0000-0000-000000000010`

### Patient UUIDs
- patient1-10: `b0000001-0000-0000-0000-00000000000X` (X = 1-10)
