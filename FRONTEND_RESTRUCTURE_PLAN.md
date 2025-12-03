# 📋 Kế Hoạch Tái Cấu Trúc Frontend - 3 Portal Riêng Biệt

## 1. Tổng Quan

### 1.1 Vấn Đề Hiện Tại
- **Admin** đang dùng chung `MainLayout` với Patient → có thể truy cập Medical Records, Notifications (không phù hợp)
- **Doctor** đã có `DoctorLayout` riêng nhưng chưa đầy đủ chức năng
- **Patient** portal thiếu chức năng đánh giá/báo cáo bác sĩ
- Không có sự phân tách rõ ràng về navigation và UI/UX giữa 3 roles

### 1.2 Giải Pháp: Option B
**1 ứng dụng React với 3 routes/layouts riêng biệt:**
- `/` và `/patient/*` → Patient Portal
- `/doctor/*` → Doctor Portal  
- `/admin/*` → Admin Portal

---

## 2. Cấu Trúc Thư Mục Đề Xuất

```
frontend-web/src/
├── components/
│   ├── common/              # Components dùng chung (Button, Modal, Table...)
│   ├── layout/
│   │   ├── PatientLayout.jsx    # Layout cho Patient (rename từ MainLayout)
│   │   ├── DoctorLayout.jsx     # Layout cho Doctor (đã có)
│   │   ├── AdminLayout.jsx      # Layout cho Admin (tạo mới)
│   │   ├── PublicLayout.jsx     # Layout cho trang public (Home, Login...)
│   │   ├── Header.jsx           # Header chung (có thể customize theo role)
│   │   └── ProtectedRoute.jsx
│   ├── patient/             # Components riêng cho Patient
│   ├── doctor/              # Components riêng cho Doctor
│   └── admin/               # Components riêng cho Admin
│
├── pages/
│   ├── public/              # Trang công khai (ai cũng xem được)
│   │   ├── Home.jsx
│   │   ├── DoctorList.jsx
│   │   ├── DoctorDetail.jsx
│   │   └── auth/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       └── OAuthCallback.jsx
│   │
│   ├── patient/             # Trang cho Patient (cần đăng nhập)
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Bookings.jsx
│   │   ├── BookingHistory.jsx
│   │   ├── MedicalRecords.jsx
│   │   ├── Notifications.jsx
│   │   ├── Payment.jsx
│   │   ├── DoctorApplication.jsx
│   │   ├── DoctorReview.jsx       # MỚI: Đánh giá bác sĩ
│   │   ├── ReportDoctor.jsx       # MỚI: Báo cáo bác sĩ
│   │   ├── MyReports.jsx
│   │   ├── MyWarnings.jsx
│   │   └── MyPenalties.jsx
│   │
│   ├── doctor/              # Trang cho Doctor
│   │   ├── Dashboard.jsx
│   │   ├── Appointments.jsx
│   │   ├── Schedule.jsx
│   │   ├── PatientRecords.jsx
│   │   ├── Profile.jsx
│   │   ├── Notifications.jsx
│   │   ├── ConsultationFee.jsx    # MỚI: Cài đặt phí khám
│   │   ├── Earnings.jsx           # Thu nhập
│   │   └── Settings.jsx
│   │
│   └── admin/               # Trang cho Admin
│       ├── Dashboard.jsx
│       ├── Statistics.jsx
│       ├── UserManagement.jsx
│       ├── DoctorApprovals.jsx
│       ├── ReportManagement.jsx
│       ├── WarningManagement.jsx
│       ├── PenaltyManagement.jsx
│       ├── CommissionSettings.jsx  # MỚI: Cài đặt hoa hồng
│       └── SystemSettings.jsx
```

---

## 3. Chi Tiết Chức Năng Từng Portal

### 3.1 🏥 Patient Portal (`/` và `/patient/*`)

| Trang | Route | Mô tả |
|-------|-------|-------|
| Home | `/` | Trang chủ, tìm kiếm bác sĩ |
| Doctor List | `/doctors` | Danh sách bác sĩ theo chuyên khoa |
| Doctor Detail | `/doctors/:id` | Chi tiết bác sĩ + đặt lịch |
| Login/Register | `/login`, `/register` | Đăng nhập/đăng ký |
| Dashboard | `/patient/dashboard` | Tổng quan sức khỏe cá nhân |
| Profile | `/patient/profile` | Hồ sơ cá nhân |
| My Bookings | `/patient/bookings` | Lịch sử đặt khám |
| Medical Records | `/patient/medical-records` | Hồ sơ sức khỏe |
| Notifications | `/patient/notifications` | Thông báo |
| Payment | `/patient/payment/:id` | Thanh toán |
| **Doctor Review** | `/patient/review/:appointmentId` | **MỚI:** Đánh giá bác sĩ sau khám |
| **Report Doctor** | `/patient/report/:doctorId` | **MỚI:** Báo cáo bác sĩ vi phạm |
| Apply Doctor | `/patient/apply-doctor` | Đăng ký làm bác sĩ |
| My Reports | `/patient/my-reports` | Báo cáo của tôi |
| My Warnings | `/patient/my-warnings` | Cảnh báo nhận được |
| My Penalties | `/patient/my-penalties` | Các hình phạt |

**Sidebar Navigation:**
```
📊 Dashboard
👤 Hồ sơ cá nhân
📅 Lịch hẹn của tôi
📋 Hồ sơ sức khỏe
🔔 Thông báo
⭐ Đánh giá đã gửi
📝 Báo cáo của tôi
⚠️ Cảnh báo
🚫 Hình phạt
```

---

### 3.2 👨‍⚕️ Doctor Portal (`/doctor/*`)

| Trang | Route | Mô tả |
|-------|-------|-------|
| Dashboard | `/doctor` | Tổng quan: lịch hẹn hôm nay, stats |
| Appointments | `/doctor/appointments` | Quản lý lịch hẹn khám |
| Schedule | `/doctor/schedule` | **Lịch làm việc dạng thời khóa biểu** |
| Patient Records | `/doctor/patients` | Xem hồ sơ bệnh nhân đã khám |
| Profile | `/doctor/profile` | Hồ sơ bác sĩ (chuyên khoa, kinh nghiệm...) |
| Notifications | `/doctor/notifications` | Thông báo (lịch hẹn mới, hủy...) |
| **Consultation Fee** | `/doctor/fees` | **MỚI:** Cài đặt phí khám |
| Earnings | `/doctor/earnings` | Thu nhập, lịch sử thanh toán |
| Reviews | `/doctor/reviews` | Xem đánh giá từ bệnh nhân |
| Settings | `/doctor/settings` | Cài đặt tài khoản |

**Sidebar Navigation:**
```
📊 Tổng quan
📅 Lịch khám
🕐 Lịch làm việc      ← Dạng thời khóa biểu
👥 Hồ sơ bệnh nhân
💰 Phí khám          ← MỚI
💵 Thu nhập
⭐ Đánh giá
👤 Hồ sơ của tôi
🔔 Thông báo
⚙️ Cài đặt
```

**Chi tiết trang Lịch Làm Việc (`/doctor/schedule`) - DẠNG THỜI KHÓA BIỂU:**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Lịch làm việc tuần: 02/12/2025 - 08/12/2025        [← Tuần trước] [Tuần sau →] │
├──────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬────────┤
│ Giờ  │  Thứ 2   │  Thứ 3   │  Thứ 4   │  Thứ 5   │  Thứ 6   │  Thứ 7   │ CN     │
├──────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼────────┤
│ 07:00│          │          │          │ ████████ │ ████████ │          │        │
│ 07:30│          │          │          │ Khám     │ Khám     │          │        │
│ 08:00│ ████████ │ ████████ │          │ tổng     │ chuyên   │ ████████ │        │
│ 08:30│ Khám     │ Khám     │          │ quát     │ khoa     │ Khám     │        │
│ 09:00│ tổng     │ tổng     │          │ ████████ │ ████████ │ tổng     │        │
│ 09:30│ quát     │ quát     │          │          │          │ quát     │        │
│ 10:00│ ████████ │ ████████ │          │          │          │ ████████ │        │
│ ...  │          │          │          │          │          │          │        │
│ 14:00│ ████████ │          │ ████████ │ ████████ │          │          │        │
│ 14:30│ Tư vấn   │          │ Khám     │ Tư vấn   │          │          │        │
│ 15:00│ online   │          │ tổng     │ online   │          │          │        │
│ ...  │          │          │          │          │          │          │        │
└──────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴────────┘

[+ Thêm ca làm việc]  [Áp dụng cho tuần sau]  [💾 Lưu thay đổi]
```

**Tính năng:**
- Click vào ô trống để thêm ca làm việc
- Drag để chọn nhiều ô liên tiếp
- Click vào ca đã có để sửa/xóa
- Màu sắc phân biệt loại khám (tổng quát, chuyên khoa, online)
- Hiển thị số lượng slot còn trống
- Copy lịch tuần này sang tuần sau

**Chi tiết trang Phí Khám (`/doctor/fees`):**
- Giá khám tổng quát (VNĐ)
- Giá khám chuyên khoa (VNĐ)
- Giá tư vấn online (VNĐ)
- Giá tái khám (VNĐ)
- Hiển thị % hoa hồng platform (chỉ đọc)
- Hiển thị số tiền thực nhận sau hoa hồng

---

### 3.3 🛡️ Admin Portal (`/admin/*`)

| Trang | Route | Mô tả |
|-------|-------|-------|
| Dashboard | `/admin` | Tổng quan hệ thống |
| Statistics | `/admin/statistics` | Thống kê chi tiết |
| User Management | `/admin/users` | Quản lý người dùng (Patient/Doctor) |
| Doctor Approvals | `/admin/approvals` | Duyệt đơn đăng ký bác sĩ |
| Report Management | `/admin/reports` | Quản lý báo cáo vi phạm |
| Warning Management | `/admin/warnings` | Quản lý cảnh báo |
| Penalty Management | `/admin/penalties` | Quản lý hình phạt |
| **Commission Settings** | `/admin/commission` | **MỚI:** Cài đặt % hoa hồng |
| System Settings | `/admin/settings` | Cài đặt hệ thống |

**Sidebar Navigation:**
```
📊 Dashboard
📈 Thống kê
👥 Quản lý người dùng
✅ Duyệt bác sĩ
📝 Báo cáo vi phạm
⚠️ Cảnh báo
🚫 Hình phạt
💰 Hoa hồng         ← MỚI
⚙️ Cài đặt hệ thống
```

**Chi tiết trang Hoa Hồng (`/admin/commission`):**
- % hoa hồng mặc định (ví dụ: 15%)
- % hoa hồng theo chuyên khoa (có thể khác nhau)
- % hoa hồng theo tier bác sĩ (VIP doctor ít hơn...)
- Lịch sử thay đổi hoa hồng
- Thống kê doanh thu hoa hồng

---

## 4. Layouts Riêng Biệt

### 4.1 PatientLayout (cho bệnh nhân đã đăng nhập)
```
┌─────────────────────────────────────────────────────┐
│  Logo    Home  Doctors  Bookings    🔔  [Avatar ▼] │  ← Header
├─────────────────────────────────────────────────────┤
│                                                     │
│                   Page Content                      │  ← Main
│                                                     │
├─────────────────────────────────────────────────────┤
│                     Footer                          │
└─────────────────────────────────────────────────────┘
```

### 4.2 DoctorLayout (cho bác sĩ)
```
┌──────────┬──────────────────────────────────────────┐
│          │  Doctor Portal     🔔  [Dr. Name ▼]     │  ← Header
│  Logo    ├──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │              Page Content                │  ← Main
│  Menu    │                                          │
│          │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### 4.3 AdminLayout (cho admin)
```
┌──────────┬──────────────────────────────────────────┐
│          │  Admin Panel       🔔  [Admin ▼]        │  ← Header
│  Logo    ├──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │              Page Content                │  ← Main
│  Menu    │                                          │
│          │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

---

## 5. Routing Structure

```jsx
// App.jsx - Cấu trúc routes mới

<Routes>
  {/* ======== PUBLIC ROUTES ======== */}
  <Route element={<PublicLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/doctors" element={<DoctorList />} />
    <Route path="/doctors/:id" element={<DoctorDetail />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Route>

  {/* ======== PATIENT ROUTES ======== */}
  <Route 
    path="/patient" 
    element={
      <ProtectedRoute roles={['PATIENT']}>
        <PatientLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<PatientDashboard />} />
    <Route path="profile" element={<PatientProfile />} />
    <Route path="bookings" element={<MyBookings />} />
    <Route path="medical-records" element={<MedicalRecords />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="payment/:appointmentId" element={<Payment />} />
    <Route path="review/:appointmentId" element={<DoctorReview />} />    {/* MỚI */}
    <Route path="report/:doctorId" element={<ReportDoctor />} />        {/* MỚI */}
    <Route path="apply-doctor" element={<DoctorApplication />} />
    <Route path="my-reports" element={<MyReports />} />
    <Route path="my-warnings" element={<MyWarnings />} />
    <Route path="my-penalties" element={<MyPenalties />} />
  </Route>

  {/* ======== DOCTOR ROUTES ======== */}
  <Route 
    path="/doctor" 
    element={
      <ProtectedRoute roles={['DOCTOR']}>
        <DoctorLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<DoctorDashboard />} />
    <Route path="appointments" element={<DoctorAppointments />} />
    <Route path="schedule" element={<DoctorSchedule />} />
    <Route path="patients" element={<PatientRecords />} />
    <Route path="profile" element={<DoctorProfile />} />
    <Route path="notifications" element={<DoctorNotifications />} />
    <Route path="fees" element={<ConsultationFee />} />                 {/* MỚI */}
    <Route path="earnings" element={<DoctorEarnings />} />
    <Route path="reviews" element={<DoctorReviews />} />
    <Route path="settings" element={<DoctorSettings />} />
  </Route>

  {/* ======== ADMIN ROUTES ======== */}
  <Route 
    path="/admin" 
    element={
      <ProtectedRoute roles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="statistics" element={<Statistics />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="approvals" element={<DoctorApprovals />} />
    <Route path="reports" element={<ReportManagement />} />
    <Route path="warnings" element={<WarningManagement />} />
    <Route path="penalties" element={<PenaltyManagement />} />
    <Route path="commission" element={<CommissionSettings />} />        {/* MỚI */}
    <Route path="settings" element={<SystemSettings />} />
  </Route>

  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 6. Database Schema Additions (Backend)

### 6.1 Bảng `doctor_fees` (Phí khám của bác sĩ)
```sql
CREATE TABLE doctor_fees (
    id UUID PRIMARY KEY,
    doctor_id UUID REFERENCES doctors(id),
    general_consultation_fee DECIMAL(12,2),      -- Phí khám tổng quát
    specialist_consultation_fee DECIMAL(12,2),   -- Phí khám chuyên khoa
    online_consultation_fee DECIMAL(12,2),       -- Phí tư vấn online
    follow_up_fee DECIMAL(12,2),                 -- Phí tái khám
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 6.2 Bảng `platform_commission` (Hoa hồng platform)
```sql
CREATE TABLE platform_commission (
    id UUID PRIMARY KEY,
    name VARCHAR(100),                -- Tên cấu hình (default, premium...)
    percentage DECIMAL(5,2),          -- % hoa hồng (15.00 = 15%)
    specialty_id UUID NULL,           -- NULL = áp dụng cho tất cả
    min_fee DECIMAL(12,2) DEFAULT 0,  -- Phí tối thiểu
    max_fee DECIMAL(12,2) NULL,       -- Phí tối đa (NULL = không giới hạn)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by UUID REFERENCES users(id)
);
```

### 6.3 Bảng `doctor_reviews` (Đánh giá bác sĩ)
```sql
CREATE TABLE doctor_reviews (
    id UUID PRIMARY KEY,
    doctor_id UUID REFERENCES doctors(id),
    patient_id UUID REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),  -- 1-5 sao
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## 7. Công Việc Cần Làm

### Phase 1: Tạo Layouts Mới
- [ ] Tạo `AdminLayout.jsx` (sidebar + header riêng)
- [ ] Tạo `PatientLayout.jsx` (rename/refactor từ MainLayout)
- [ ] Cập nhật `DoctorLayout.jsx` (thêm menu items mới)
- [ ] Tạo `PublicLayout.jsx` (cho trang không cần đăng nhập)

### Phase 2: Tái Cấu Trúc Routes
- [ ] Di chuyển pages vào đúng thư mục
- [ ] Cập nhật `App.jsx` với routes mới
- [ ] Cập nhật `ProtectedRoute` để redirect đúng portal

### Phase 3: Tạo Pages Mới
- [ ] **Patient:** `DoctorReview.jsx`, `ReportDoctor.jsx`
- [ ] **Doctor:** `ConsultationFee.jsx`, `DoctorEarnings.jsx`, `DoctorReviews.jsx`
- [ ] **Admin:** `CommissionSettings.jsx`, `DoctorApprovals.jsx`

### Phase 4: Backend APIs (nếu chưa có)
- [ ] API: Doctor fees CRUD
- [ ] API: Platform commission CRUD
- [ ] API: Doctor reviews CRUD
- [ ] API: Doctor reports

### Phase 5: Integration & Testing
- [ ] Kết nối frontend với backend APIs
- [ ] Test role-based access
- [ ] Test UI/UX từng portal

---

## 8. Ước Tính Thời Gian

| Phase | Công việc | Thời gian |
|-------|-----------|-----------|
| 1 | Tạo Layouts | 2-3 giờ |
| 2 | Tái cấu trúc Routes | 1-2 giờ |
| 3 | Tạo Pages mới | 4-6 giờ |
| 4 | Backend APIs | 3-4 giờ |
| 5 | Integration & Testing | 2-3 giờ |
| **Tổng** | | **12-18 giờ** |

---

## 9. Xác Nhận

**Vui lòng xác nhận:**
1. ✅ Cấu trúc 3 portals như trên có phù hợp?
2. ✅ Danh sách chức năng đầy đủ chưa?
3. ✅ Database schema có cần điều chỉnh?
4. ✅ Có muốn implement theo phases hay làm hết một lần?

---

*Báo cáo được tạo: 04/12/2025*
