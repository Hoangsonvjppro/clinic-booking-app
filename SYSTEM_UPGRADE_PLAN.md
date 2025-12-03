# 📋 KẾ HOẠCH NÂNG CẤP HỆ THỐNG CLINIC BOOKING APP

> **Ngày tạo:** 3/12/2024  
> **Mục tiêu:** Xây dựng hệ thống 3 bên hoàn chỉnh: **Admin (Chủ nhà)** - **Bác sĩ (Nhà cung cấp)** - **Bệnh nhân (Người dùng)**

---

## 📊 PHÂN TÍCH HIỆN TRẠNG

### Những gì đã có ✅
| Tính năng | Trạng thái | Ghi chú |
|-----------|------------|---------|
| Đăng ký/Đăng nhập | ✅ Hoàn thành | JWT + OAuth Google |
| Quản lý User Roles | ✅ Hoàn thành | USER, DOCTOR, PATIENT, ADMIN |
| Đăng ký bác sĩ | ✅ Hoàn thành | Multi-step form + upload certificates |
| Duyệt hồ sơ bác sĩ | ✅ Hoàn thành | Admin approve/reject |
| Tìm kiếm bác sĩ | ✅ Hoàn thành | Filter by specialty, sort by rating |
| Đặt lịch khám | ✅ Hoàn thành | 3-step booking workflow |
| Thanh toán | ✅ Hoàn thành | Card, MoMo, Bank transfer |
| Hồ sơ bệnh án | ✅ Hoàn thành | Medical records per appointment |
| Notification | ✅ Hoàn thành | Email notifications |

### Những gì còn thiếu ❌
| Tính năng | Mức độ ưu tiên | Mô tả |
|-----------|---------------|-------|
| **Hệ thống báo cáo (Report)** | 🔴 Cao | Báo cáo từ bệnh nhân ↔ bác sĩ |
| **Xử lý báo cáo của Admin** | 🔴 Cao | Gửi cảnh báo, chặn tài khoản |
| **Hệ thống cảnh báo (Warning)** | 🔴 Cao | Lưu lịch sử cảnh báo cho user |
| **Penalty System** | 🟡 Trung bình | Tính phí gấp đôi cho vi phạm |
| **Admin Statistics** | 🟡 Trung bình | Dashboard chi tiết hơn |
| **Doctor Dashboard** | 🟡 Trung bình | Quản lý lịch hẹn, bệnh nhân |
| **No-show Tracking** | 🟡 Trung bình | Theo dõi bệnh nhân không đến |

---

## 🏗️ KIẾN TRÚC HỆ THỐNG 3 BÊN

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              🏠 ADMIN (CHỦ NHÀ)                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ Duyệt hồ sơ BS  │  │  Xử lý báo cáo  │  │  Quản lý users  │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           ▼                    ▼                    ▼                       │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │              Gửi cảnh báo / Chặn tài khoản                   │           │
│  └─────────────────────────────────────────────────────────────┘           │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│       👨‍⚕️ BÁC SĨ                 │   │       👤 BỆNH NHÂN              │
│  ┌───────────────────────────┐  │   │  ┌───────────────────────────┐  │
│  │ • Nhận lịch hẹn           │  │   │  │ • Tìm & đặt lịch khám     │  │
│  │ • Quản lý schedule        │  │   │  │ • Xem hồ sơ bệnh án       │  │
│  │ • Tạo bệnh án             │  │   │  │ • Đánh giá bác sĩ         │  │
│  │ • Báo cáo bệnh nhân       │◄─┼───┼─►│ • Báo cáo bác sĩ          │  │
│  │ • Nhận cảnh báo từ admin  │  │   │  │ • Nhận cảnh báo từ admin  │  │
│  └───────────────────────────┘  │   │  └───────────────────────────┘  │
└─────────────────────────────────┘   └─────────────────────────────────┘
```

---

## 📦 PHASE 1: DATABASE SCHEMA MỚI

### 1.1. Bảng `reports` (Báo cáo vi phạm)

```sql
-- Trong notification-service hoặc tạo report-service mới
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Người báo cáo
    reporter_id UUID NOT NULL,           -- User ID người báo cáo
    reporter_type VARCHAR(20) NOT NULL,  -- PATIENT hoặc DOCTOR
    
    -- Đối tượng bị báo cáo
    reported_id UUID NOT NULL,           -- User ID người bị báo cáo
    reported_type VARCHAR(20) NOT NULL,  -- PATIENT hoặc DOCTOR
    
    -- Chi tiết báo cáo
    report_type VARCHAR(50) NOT NULL,    -- Loại vi phạm
    appointment_id UUID,                  -- Liên quan đến lịch hẹn nào (nếu có)
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[],                 -- URLs hình ảnh/file chứng cứ
    
    -- Trạng thái xử lý
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PENDING, REVIEWING, RESOLVED, DISMISSED
    
    -- Admin xử lý
    admin_id UUID,                        -- Admin xử lý báo cáo
    admin_notes TEXT,                     -- Ghi chú của admin
    resolution VARCHAR(50),               -- WARNING, PENALTY, BLOCK, DISMISS
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index cho query
CREATE INDEX idx_reports_reporter ON reports(reporter_id, reporter_type);
CREATE INDEX idx_reports_reported ON reports(reported_id, reported_type);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created ON reports(created_at DESC);
```

### 1.2. Các loại báo cáo (Report Types)

```sql
-- Báo cáo từ BỆNH NHÂN về BÁC SĨ
PATIENT_REPORT_TYPES:
  - POOR_SERVICE_QUALITY     -- Chất lượng dịch vụ kém
  - UNPROFESSIONAL_BEHAVIOR  -- Hành vi thiếu chuyên nghiệp
  - WRONG_DIAGNOSIS          -- Chẩn đoán sai
  - OVERCHARGING             -- Thu phí quá cao
  - NO_SHOW_DOCTOR           -- Bác sĩ không có mặt
  - RUDE_BEHAVIOR            -- Thái độ thô lỗ
  - OTHER                    -- Khác

-- Báo cáo từ BÁC SĨ về BỆNH NHÂN
DOCTOR_REPORT_TYPES:
  - NO_SHOW_PATIENT          -- Bệnh nhân không đến (quan trọng nhất)
  - LATE_ARRIVAL             -- Đến muộn
  - ABUSIVE_BEHAVIOR         -- Hành vi lạm dụng
  - FAKE_INFORMATION         -- Thông tin giả mạo
  - REPEATED_CANCELLATION    -- Hủy lịch liên tục
  - OTHER                    -- Khác
```

### 1.3. Bảng `warnings` (Cảnh báo)

```sql
CREATE TABLE warnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Người nhận cảnh báo
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL,      -- PATIENT hoặc DOCTOR
    
    -- Chi tiết cảnh báo
    warning_type VARCHAR(50) NOT NULL,   -- WARNING, PENALTY, FINAL_WARNING
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Liên kết với báo cáo
    report_id UUID REFERENCES reports(id),
    
    -- Admin gửi cảnh báo
    issued_by UUID NOT NULL,             -- Admin ID
    
    -- Đã đọc chưa
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Hết hạn (nếu có)
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_warnings_user ON warnings(user_id, user_type);
CREATE INDEX idx_warnings_unread ON warnings(user_id, is_read) WHERE is_read = FALSE;
```

### 1.4. Bảng `user_penalties` (Hình phạt)

```sql
CREATE TABLE user_penalties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    
    -- Loại hình phạt
    penalty_type VARCHAR(50) NOT NULL,   
    -- DOUBLE_BOOKING_FEE: Phí đặt lịch gấp đôi
    -- TEMPORARY_BAN: Tạm khóa tài khoản (1-7 ngày)
    -- PERMANENT_BAN: Khóa vĩnh viễn
    -- RATING_PENALTY: Trừ điểm đánh giá
    
    -- Chi tiết
    description TEXT,
    multiplier DECIMAL(3,2) DEFAULT 1.0, -- Hệ số nhân phí (2.0 = gấp đôi)
    
    -- Liên kết
    report_id UUID REFERENCES reports(id),
    warning_id UUID REFERENCES warnings(id),
    
    -- Admin áp dụng
    issued_by UUID NOT NULL,
    
    -- Thời gian hiệu lực
    effective_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    effective_until TIMESTAMP WITH TIME ZONE,  -- NULL = vĩnh viễn
    
    -- Trạng thái
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_penalties_user ON user_penalties(user_id, user_type);
CREATE INDEX idx_penalties_active ON user_penalties(user_id, is_active) WHERE is_active = TRUE;
```

### 1.5. Bảng `user_statistics` (Thống kê user)

```sql
CREATE TABLE user_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID NOT NULL UNIQUE,
    user_type VARCHAR(20) NOT NULL,
    
    -- Thống kê chung
    total_appointments INT NOT NULL DEFAULT 0,
    completed_appointments INT NOT NULL DEFAULT 0,
    cancelled_appointments INT NOT NULL DEFAULT 0,
    no_show_count INT NOT NULL DEFAULT 0,
    
    -- Rating (cho cả patient và doctor)
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INT NOT NULL DEFAULT 0,
    
    -- Cảnh báo & vi phạm
    warning_count INT NOT NULL DEFAULT 0,
    penalty_count INT NOT NULL DEFAULT 0,
    report_count INT NOT NULL DEFAULT 0,       -- Số lần bị báo cáo
    reports_filed_count INT NOT NULL DEFAULT 0, -- Số lần báo cáo người khác
    
    -- Timestamps
    last_appointment_at TIMESTAMP WITH TIME ZONE,
    last_warning_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_user_stats_user ON user_statistics(user_id);
```

### 1.6. Cập nhật bảng `users` trong Auth Service

```sql
-- Thêm các column mới
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';
-- ACTIVE: Hoạt động bình thường
-- WARNED: Đã bị cảnh báo
-- SUSPENDED: Tạm khóa
-- BANNED: Khóa vĩnh viễn

ALTER TABLE users ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_by UUID;
```

---

## 📦 PHASE 2: BACKEND API ENDPOINTS

### 2.1. Report Service APIs

```yaml
# === PATIENT báo cáo DOCTOR ===
POST   /api/v1/reports/patient-to-doctor
  Body: { doctorId, appointmentId?, reportType, title, description, evidenceUrls? }
  Auth: PATIENT role required

# === DOCTOR báo cáo PATIENT ===
POST   /api/v1/reports/doctor-to-patient
  Body: { patientId, appointmentId, reportType, title, description }
  Auth: DOCTOR role required

# === Lấy danh sách báo cáo của tôi ===
GET    /api/v1/reports/my-reports
  Query: { page, size, status?, type? }
  Auth: PATIENT or DOCTOR

# === Lấy danh sách báo cáo về tôi ===
GET    /api/v1/reports/against-me
  Query: { page, size, status? }
  Auth: PATIENT or DOCTOR

# === Admin: Lấy tất cả báo cáo ===
GET    /api/v1/admin/reports
  Query: { page, size, status?, reporterType?, reportedType?, fromDate?, toDate? }
  Auth: ADMIN role required

# === Admin: Chi tiết báo cáo ===
GET    /api/v1/admin/reports/{reportId}
  Auth: ADMIN role required

# === Admin: Xử lý báo cáo ===
PUT    /api/v1/admin/reports/{reportId}/resolve
  Body: { resolution, adminNotes, warningMessage?, penaltyType?, penaltyDuration? }
  Auth: ADMIN role required
  
  resolution options:
    - DISMISS: Bỏ qua báo cáo (không vi phạm)
    - WARNING: Gửi cảnh báo
    - PENALTY: Áp dụng hình phạt
    - SUSPEND: Tạm khóa tài khoản
    - BAN: Khóa vĩnh viễn
```

### 2.2. Warning Service APIs

```yaml
# === Lấy cảnh báo của tôi ===
GET    /api/v1/warnings/my-warnings
  Query: { page, size, isRead? }
  Auth: Any authenticated user

# === Đánh dấu đã đọc ===
PUT    /api/v1/warnings/{warningId}/read
  Auth: Owner only

# === Admin: Gửi cảnh báo trực tiếp ===
POST   /api/v1/admin/warnings
  Body: { userId, userType, warningType, title, message, expiresAt? }
  Auth: ADMIN role required

# === Đếm cảnh báo chưa đọc ===
GET    /api/v1/warnings/unread-count
  Auth: Any authenticated user
```

### 2.3. Penalty Service APIs

```yaml
# === Kiểm tra penalty hiện tại ===
GET    /api/v1/penalties/my-penalties
  Query: { activeOnly? }
  Auth: Any authenticated user

# === Kiểm tra hệ số phí đặt lịch ===
GET    /api/v1/penalties/booking-fee-multiplier
  Auth: PATIENT role
  Response: { multiplier: 1.0 | 2.0 }

# === Admin: Áp dụng penalty ===
POST   /api/v1/admin/penalties
  Body: { userId, userType, penaltyType, description, multiplier?, durationDays? }
  Auth: ADMIN role required

# === Admin: Gỡ penalty ===
DELETE /api/v1/admin/penalties/{penaltyId}
  Auth: ADMIN role required
```

### 2.4. User Account Management APIs

```yaml
# === Admin: Cập nhật trạng thái tài khoản ===
PUT    /api/v1/admin/users/{userId}/status
  Body: { status, reason?, suspendDays? }
  Auth: ADMIN role required
  
  status options:
    - ACTIVE: Kích hoạt lại
    - WARNED: Đánh dấu đã cảnh báo
    - SUSPENDED: Tạm khóa
    - BANNED: Khóa vĩnh viễn

# === Admin: Lấy danh sách users ===
GET    /api/v1/admin/users
  Query: { page, size, role?, status?, search? }
  Auth: ADMIN role required

# === Admin: Chi tiết user (bao gồm statistics) ===
GET    /api/v1/admin/users/{userId}/detail
  Auth: ADMIN role required
  Response: { user, statistics, warnings, penalties, reports }
```

### 2.5. Statistics APIs

```yaml
# === Lấy thống kê của tôi ===
GET    /api/v1/statistics/me
  Auth: Any authenticated user

# === Admin: Dashboard statistics ===
GET    /api/v1/admin/statistics/dashboard
  Auth: ADMIN role required
  Response: {
    totalUsers, totalDoctors, totalPatients,
    pendingReports, resolvedReports,
    activeWarnings, activePenalties,
    appointmentsToday, appointmentsThisWeek,
    revenueThisMonth
  }

# === Admin: Reports statistics ===
GET    /api/v1/admin/statistics/reports
  Query: { fromDate, toDate }
  Auth: ADMIN role required
```

---

## 📦 PHASE 3: FRONTEND UPDATES

### 3.1. Admin Dashboard Mới

```
/admin
├── /dashboard              # Dashboard tổng quan
├── /users                  # Quản lý users
│   ├── /                   # Danh sách (filter by role, status)
│   └── /:userId           # Chi tiết user + actions
├── /doctors                # Quản lý bác sĩ
│   ├── /applications      # Duyệt hồ sơ đăng ký (đã có)
│   └── /:doctorId         # Chi tiết + xử lý
├── /patients               # Quản lý bệnh nhân
│   └── /:patientId        # Chi tiết + xử lý
├── /reports                # Xử lý báo cáo
│   ├── /                   # Danh sách báo cáo (filter by status, type)
│   └── /:reportId         # Chi tiết + resolve
├── /warnings               # Lịch sử cảnh báo
└── /statistics             # Thống kê chi tiết
```

### 3.2. Doctor Dashboard Mới

```
/doctor
├── /dashboard              # Dashboard bác sĩ
├── /appointments           # Quản lý lịch hẹn
│   ├── /                   # Lịch hẹn (calendar view)
│   ├── /today              # Hôm nay
│   └── /:appointmentId    # Chi tiết + tạo bệnh án
├── /patients               # Bệnh nhân của tôi
│   └── /:patientId        # Lịch sử khám của bệnh nhân
├── /schedule               # Quản lý lịch làm việc
├── /reports
│   ├── /new               # Báo cáo bệnh nhân mới
│   └── /                   # Lịch sử báo cáo của tôi
├── /warnings               # Cảnh báo nhận được
├── /reviews                # Đánh giá từ bệnh nhân
└── /profile                # Cập nhật thông tin
```

### 3.3. Patient Dashboard Cập nhật

```
/dashboard (đã có, cần bổ sung)
├── /                       # Tổng quan
├── /appointments           # Lịch hẹn (đã có)
├── /medical-records        # Hồ sơ bệnh án (đã có)
├── /reports
│   ├── /new               # Báo cáo bác sĩ mới
│   └── /                   # Lịch sử báo cáo
├── /warnings               # Cảnh báo nhận được (MỚI)
└── /profile                # Thông tin cá nhân (đã có)
```

### 3.4. Components Mới Cần Tạo

```
components/
├── admin/
│   ├── ReportList.jsx           # Danh sách báo cáo
│   ├── ReportDetail.jsx         # Chi tiết báo cáo
│   ├── ReportResolveModal.jsx   # Modal xử lý báo cáo
│   ├── UserDetail.jsx           # Chi tiết user
│   ├── UserStatusBadge.jsx      # Badge trạng thái
│   ├── WarningModal.jsx         # Modal gửi cảnh báo
│   ├── PenaltyModal.jsx         # Modal áp dụng hình phạt
│   └── StatisticsCharts.jsx     # Biểu đồ thống kê
│
├── doctor/
│   ├── DoctorDashboard.jsx      # Dashboard bác sĩ
│   ├── AppointmentCalendar.jsx  # Lịch hẹn dạng calendar
│   ├── PatientReportForm.jsx    # Form báo cáo bệnh nhân
│   ├── MedicalRecordForm.jsx    # Form tạo bệnh án
│   └── ScheduleManager.jsx      # Quản lý lịch làm việc
│
├── patient/
│   ├── DoctorReportForm.jsx     # Form báo cáo bác sĩ
│   └── WarningList.jsx          # Danh sách cảnh báo
│
└── common/
    ├── ReportForm.jsx           # Form báo cáo chung
    ├── WarningCard.jsx          # Card hiển thị cảnh báo
    ├── PenaltyBanner.jsx        # Banner thông báo penalty
    └── StatusTimeline.jsx       # Timeline xử lý báo cáo
```

### 3.5. API Services Mới

```javascript
// api/reportApi.js
export const reportApi = {
  // Patient báo cáo Doctor
  reportDoctor: (data) => axios.post('/v1/reports/patient-to-doctor', data),
  
  // Doctor báo cáo Patient
  reportPatient: (data) => axios.post('/v1/reports/doctor-to-patient', data),
  
  // Lấy báo cáo của tôi
  getMyReports: (params) => axios.get('/v1/reports/my-reports', { params }),
  
  // Lấy báo cáo về tôi
  getReportsAgainstMe: (params) => axios.get('/v1/reports/against-me', { params }),
  
  // Admin APIs
  getAllReports: (params) => axios.get('/v1/admin/reports', { params }),
  getReportById: (id) => axios.get(`/v1/admin/reports/${id}`),
  resolveReport: (id, data) => axios.put(`/v1/admin/reports/${id}/resolve`, data),
};

// api/warningApi.js
export const warningApi = {
  getMyWarnings: (params) => axios.get('/v1/warnings/my-warnings', { params }),
  markAsRead: (id) => axios.put(`/v1/warnings/${id}/read`),
  getUnreadCount: () => axios.get('/v1/warnings/unread-count'),
  
  // Admin
  sendWarning: (data) => axios.post('/v1/admin/warnings', data),
};

// api/penaltyApi.js
export const penaltyApi = {
  getMyPenalties: (params) => axios.get('/v1/penalties/my-penalties', { params }),
  getBookingFeeMultiplier: () => axios.get('/v1/penalties/booking-fee-multiplier'),
  
  // Admin
  applyPenalty: (data) => axios.post('/v1/admin/penalties', data),
  removePenalty: (id) => axios.delete(`/v1/admin/penalties/${id}`),
};

// api/adminApi.js - Bổ sung
export const adminApi = {
  // Users
  getUsers: (params) => axios.get('/v1/admin/users', { params }),
  getUserDetail: (id) => axios.get(`/v1/admin/users/${id}/detail`),
  updateUserStatus: (id, data) => axios.put(`/v1/admin/users/${id}/status`, data),
  
  // Statistics
  getDashboardStats: () => axios.get('/v1/admin/statistics/dashboard'),
  getReportStats: (params) => axios.get('/v1/admin/statistics/reports', { params }),
};
```

---

## 📦 PHASE 4: BUSINESS LOGIC

### 4.1. Xử lý báo cáo bệnh nhân NO-SHOW

```
1. Bác sĩ báo cáo bệnh nhân không đến → Tạo report với type NO_SHOW_PATIENT
2. Admin xem xét báo cáo:
   - Lần 1: Gửi cảnh báo
   - Lần 2: Gửi cảnh báo nghiêm khắc
   - Lần 3+: Áp dụng penalty DOUBLE_BOOKING_FEE
3. Khi bệnh nhân đặt lịch tiếp:
   - Kiểm tra penalty → Nếu có DOUBLE_BOOKING_FEE → Tính phí x2
   - Hiển thị thông báo cho bệnh nhân biết lý do
```

### 4.2. Xử lý báo cáo bác sĩ chất lượng kém

```
1. Bệnh nhân báo cáo bác sĩ → Tạo report
2. Admin xem xét:
   - Xem rating trung bình của bác sĩ
   - Xem lịch sử báo cáo
   - Quyết định:
     a. DISMISS: Báo cáo không có cơ sở
     b. WARNING: Gửi cảnh báo đến bác sĩ
     c. PENALTY: Trừ điểm rating, giảm độ ưu tiên trong search
     d. SUSPEND: Tạm khóa hoạt động (1-7 ngày)
     e. BAN: Thu hồi quyền hành nghề trên platform
```

### 4.3. Thông báo tự động

```
Khi có báo cáo mới → Gửi email cho Admin
Khi báo cáo được xử lý → Gửi email cho reporter
Khi nhận cảnh báo → Gửi email + push notification
Khi bị áp penalty → Gửi email thông báo chi tiết
Khi tài khoản bị khóa → Gửi email với lý do
```

---

## 📦 PHASE 5: IMPLEMENTATION STEPS

### Step 1: Database Migration (1-2 ngày)
- [ ] Tạo migration cho bảng `reports`
- [ ] Tạo migration cho bảng `warnings`
- [ ] Tạo migration cho bảng `user_penalties`
- [ ] Tạo migration cho bảng `user_statistics`
- [ ] Cập nhật bảng `users` trong auth-service

### Step 2: Backend Report Service (3-4 ngày)
- [ ] Tạo entities: Report, Warning, Penalty, UserStatistics
- [ ] Tạo repositories
- [ ] Tạo DTOs
- [ ] Implement Report APIs
- [ ] Implement Warning APIs
- [ ] Implement Penalty APIs
- [ ] Implement Admin Management APIs
- [ ] Unit tests

### Step 3: Backend Integration (2-3 ngày)
- [ ] Tích hợp với Notification Service (gửi email)
- [ ] Tích hợp với Auth Service (check account status)
- [ ] Tích hợp với Payment Service (booking fee multiplier)
- [ ] Tích hợp với Appointment Service (no-show tracking)

### Step 4: Frontend Admin Pages (3-4 ngày)
- [ ] Admin Reports Management Page
- [ ] Admin User Detail Page
- [ ] Report Resolve Modal
- [ ] Warning Send Modal
- [ ] Statistics Dashboard

### Step 5: Frontend Doctor Pages (2-3 ngày)
- [ ] Doctor Dashboard
- [ ] Patient Report Form
- [ ] Warning List Page
- [ ] Appointment Calendar

### Step 6: Frontend Patient Pages (1-2 ngày)
- [ ] Doctor Report Form
- [ ] Warning List Page
- [ ] Penalty Banner

### Step 7: Testing & QA (2-3 ngày)
- [ ] Integration testing
- [ ] E2E testing
- [ ] Bug fixes
- [ ] Performance optimization

---

## 📊 TIMELINE ƯỚC TÍNH

| Phase | Công việc | Thời gian |
|-------|-----------|-----------|
| **Phase 1** | Database Schema | 1-2 ngày |
| **Phase 2** | Backend APIs | 5-7 ngày |
| **Phase 3** | Frontend | 6-9 ngày |
| **Phase 4** | Integration | 2-3 ngày |
| **Phase 5** | Testing | 2-3 ngày |
| **Tổng** | | **16-24 ngày** |

---

## 🎯 ƯU TIÊN THỰC HIỆN

### Giai đoạn 1 (MVP - 1 tuần)
1. ✅ Database schema cho reports, warnings
2. ✅ API báo cáo cơ bản (create, list)
3. ✅ Admin xem và xử lý báo cáo
4. ✅ Gửi cảnh báo cơ bản

### Giai đoạn 2 (2 tuần)
1. ⬜ Penalty system hoàn chỉnh
2. ⬜ Tích hợp tính phí gấp đôi
3. ⬜ Doctor dashboard đầy đủ
4. ⬜ Thống kê chi tiết

### Giai đoạn 3 (3 tuần+)
1. ⬜ Auto-detection vi phạm
2. ⬜ Advanced analytics
3. ⬜ Export reports
4. ⬜ Audit trail đầy đủ

---

## 📝 GHI CHÚ

### Câu hỏi cần làm rõ:
1. Report Service nên là service riêng hay tích hợp vào service hiện có?
   - **Đề xuất:** Tích hợp vào `notification-service` hoặc tạo `admin-service` mới
   
2. Có cần hệ thống appeal (khiếu nại) cho người bị xử lý không?
   - **Đề xuất:** Có, nhưng có thể làm ở phase sau

3. Thời gian penalty mặc định:
   - DOUBLE_BOOKING_FEE: 30 ngày
   - TEMPORARY_BAN: 7 ngày
   - Có thể config được

### Rủi ro:
- Cross-service communication complexity
- Data consistency giữa các service
- Performance khi query statistics

### Best Practices:
- Sử dụng Event-Driven cho cross-service updates
- Cache statistics để tăng performance
- Audit log mọi action của admin

---

> **Tài liệu này sẽ được cập nhật khi implement. Hãy confirm để bắt đầu triển khai!**
