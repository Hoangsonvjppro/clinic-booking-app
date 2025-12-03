# 🔍 BÁO CÁO REVIEW MÃ NGUỒN FRONTEND

**Ngày kiểm tra:** $(Get-Date -Format "dd/MM/yyyy")  
**Phạm vi:** frontend-web/src/**  
**Người kiểm tra:** AI Code Review Agent

---

## 📋 TÓM TẮT

| Loại lỗi | Số lượng | Mức độ nghiêm trọng |
|----------|----------|---------------------|
| Mock Data Hardcoded | 8 | 🔴 Cao |
| API URL không qua Gateway | 6 | 🔴 Cao |
| API Endpoint không nhất quán | 5 | 🟠 Trung bình |
| Duplicate Code/Components | 3 | 🟡 Thấp |
| Thiếu kết nối Backend | 4 | 🔴 Cao |
| Thiếu xử lý lỗi | 3 | 🟠 Trung bình |

---

## 🔴 VẤN ĐỀ NGHIÊM TRỌNG (CRITICAL)

### 1. Mock Data Hardcoded trong `utils/doctors.js`

**File:** `src/utils/doctors.js`

**Vấn đề:** File chứa hoàn toàn mock data với tên bác sĩ tiếng Anh không khớp với dữ liệu trong database.

```javascript
// Mock data cứng - KHÔNG ĐỒNG BỘ VỚI DATABASE
export const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", ... },
  { id: 2, name: "Dr. Robert Lee", specialty: "Dermatologist", ... },
  { id: 3, name: "St. Mary Hospital", specialty: "General Hospital", ... },
  { id: 4, name: "Dr. Emily Carter", specialty: "Neurologist", ... },
  { id: 5, name: "Dr. Michael Nguyen", specialty: "Pediatrician", ... },
  { id: 6, name: "Sunrise Medical Center", specialty: "Multi-specialty Hospital", ... },
];
```

**Database thực tế (seed data):**
- Nguyễn Văn An, Trần Thị Bình, Lê Văn Cường... (tên Việt Nam)

**Impact:** 
- Hiển thị sai thông tin bác sĩ
- Frontend không sử dụng API backend

**Files bị ảnh hưởng:**
1. `src/pages/Dashboard.jsx` - import mock doctors
2. `src/pages/DoctorPage.jsx` - import mock doctors  
3. `src/pages/BookingPage.jsx` - import mock doctors

---

### 2. API URL Trực tiếp đến Services (Bypass Gateway)

**Vấn đề:** Nhiều file gọi trực tiếp đến services thay vì qua API Gateway (port 8080)

| File | URL Sai | URL Đúng |
|------|---------|----------|
| `Dashboard.jsx` | `http://localhost:8081/api/v1/auth/me` | `http://localhost:8080/api/v1/auth/me` |
| `Profile.jsx` | `http://localhost:8081/api/v1/auth/me` | `http://localhost:8080/api/v1/auth/me` |
| `AuthPage.jsx` | `http://localhost:8081/api/v1/auth/login` | `http://localhost:8080/api/v1/auth/login` |
| `CreateDoctorAcc.jsx` | `http://localhost:8083/api/doctor/apply` | `http://localhost:8080/api/doctor/apply` |
| `AdminDoctorRequest.jsx` | `http://localhost:8083/api/doctor/all-application` | `http://localhost:8080/api/doctor/all-application` |
| `AdminDoctorRequest.jsx` | `http://localhost:8083/api/doctor/approve` | `http://localhost:8080/api/doctor/approve` |

**Impact:**
- Bypass rate limiting
- Bypass authentication middleware
- Không nhất quán với axiosConfig.js đã setup baseURL
- CORS issues trong production

---

### 3. API Endpoint Không Nhất Quán trong `doctorApi.js`

**File:** `src/api/doctorApi.js`

**Vấn đề:** Mix 2 loại endpoint paths

```javascript
// Pattern 1: /v1/doctors/* (Public API)
export const getDoctors = async (params = {}) => {
  return api.get('/v1/doctors', { params });
};
export const getDoctorById = async (id) => {
  return api.get(`/v1/doctors/${id}`);
};

// Pattern 2: /doctor/* (Application API) - THIẾU /v1/
export const applyAsDoctor = async (formData) => {
  return api.post('/doctor/apply', formData, ...); // ❌ Nên là /api/doctor/apply
};
export const approveDoctor = async (applicationId) => {
  return api.put(`/doctor/approve?id=${applicationId}`); // ❌
};
```

**Backend thực tế:**
- `DoctorPublicController`: `/api/v1/doctors/**`
- `DoctorController`: `/api/doctor/**`

**Impact:** Các endpoint application (apply, approve, reject) có thể không hoạt động

---

### 4. Gateway Thiếu Route cho Doctor Service

**File:** `api-gateway/src/main/resources/application-dev.yml`

**Vấn đề:** Không có route cho doctor-service trong API Gateway!

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/v1/auth/**
        # ... notification-service routes
        # ❌ THIẾU doctor-service routes
        # ❌ THIẾU patient-service routes  
        # ❌ THIẾU appointment-service routes
```

**Impact:** 
- Frontend gọi qua gateway sẽ không tới được doctor-service
- Đây là lý do tại sao các file đang bypass gateway

---

## 🟠 VẤN ĐỀ TRUNG BÌNH

### 5. Duplicate Pages - 2 Version của cùng 1 Page

**Vấn đề:** Có 2 version khác nhau của nhiều pages:

| Old Version (Mock Data) | New Version (API) |
|-------------------------|-------------------|
| `pages/Dashboard.jsx` | `pages/user/Dashboard.jsx` |
| `pages/DoctorPage.jsx` | `pages/doctor/DoctorDetail.jsx` |
| `pages/BookingPage.jsx` | `pages/booking/BookingPage.jsx` |
| `pages/Profile.jsx` | `pages/user/Profile.jsx` |

**Nhận diện:**
- **Old version**: import từ `../utils/doctors`, gọi API trực tiếp (localhost:8081)
- **New version**: sử dụng API từ `api/*.js`, có fallback mock data trong catch

**App.jsx đang sử dụng:** New version (đúng)

**Khuyến nghị:** Xóa các old version files không sử dụng

---

### 6. Fallback Mock Data trong API Calls

**Vấn đề:** Các page mới vẫn có mock data fallback trong catch block

**Ví dụ từ `pages/Home.jsx`:**
```javascript
const loadFeaturedDoctors = async () => {
  try {
    const response = await getDoctors({ limit: 4, sort: 'rating' });
    // ...
  } catch (error) {
    // ❌ Mock data fallback - Sẽ hiển thị sai nếu API lỗi
    setFeaturedDoctors([
      { id: 1, fullName: 'Dr. Sarah Johnson', ... },
      { id: 2, fullName: 'Dr. Michael Chen', ... },
      // ...
    ]);
  }
};
```

**Files có mock fallback:**
1. `pages/Home.jsx` - loadFeaturedDoctors
2. `pages/doctor/DoctorList.jsx` - loadDoctors
3. `pages/doctor/DoctorDetail.jsx` - loadDoctor
4. `pages/booking/BookingPage.jsx` - loadDoctor
5. `pages/admin/AdminDashboard.jsx` - loadDashboardData
6. `pages/admin/StatisticsDashboard.jsx` - fetchStatistics

---

### 7. Token Storage Không Nhất Quán

**Vấn đề:** Mix giữa localStorage và Cookies

| File | Storage Method |
|------|---------------|
| `context/AuthContext.jsx` | localStorage |
| `pages/AuthPage.jsx` | Cookies (js-cookie) |
| `pages/Dashboard.jsx` (old) | Cookies |
| `pages/Profile.jsx` (old) | Cookies |
| `api/axiosConfig.js` | localStorage |

**Impact:** Token có thể bị mất sync giữa các storage

---

### 8. Thiếu Error Handling trong Admin Components

**File:** `components/admin/AdminDoctorRequest.jsx`

```javascript
const approveApplication = async (applicationId) => {
  try {
    const res = await axios.put(`http://localhost:8083/api/doctor/approve?id=${applicationId}`, {});
    // ... chỉ update local state
  } catch (err) {
    console.error(err); // ❌ Không có UI feedback cho user
  }
};
```

---

## 🟡 VẤN ĐỀ NHỎ

### 9. Import Không Sử Dụng

**File:** `pages/DoctorPage.jsx`
```javascript
import { use } from "react"; // ❌ Không sử dụng
```

### 10. Console.log Còn Sót

Nhiều file còn console.log debug:
- `pages/Dashboard.jsx`
- `pages/AuthPage.jsx`
- `pages/CreateDoctorAcc.jsx`
- `components/admin/AdminDoctorRequest.jsx`

### 11. Dark Mode Implementation Không Nhất Quán

Old pages sử dụng custom dark mode:
```javascript
const [isDark, setIsDark] = useState(localStorage.getItem("mode"))
```

New pages không có dark mode support.

---

## 📊 MA TRẬN ĐỒNG BỘ FRONTEND-BACKEND-DATABASE

| Entity | Frontend Field | Backend Field | DB Column | Khớp? |
|--------|---------------|---------------|-----------|-------|
| Doctor.name | `fullName` | `fullName` | `full_name` | ✅ |
| Doctor.specialty | `specialty` (string) | `specialty` (object) | `specialty_id` (FK) | ❌ |
| Doctor.id | `id` (number in mock) | `id` (UUID) | `id` (UUID) | ❌ |
| Patient.id | - | `id` (UUID) | `id` (UUID) | ⚠️ Chưa kiểm tra |

---

## ✅ HÀNH ĐỘNG KHUYẾN NGHỊ

### Ưu tiên 1 (Ngay lập tức):

1. **Thêm routes cho doctor, patient, appointment vào API Gateway**
   ```yaml
   - id: doctor-service-public
     uri: http://localhost:8082
     predicates:
       - Path=/api/v1/doctors/**
   
   - id: doctor-service-application
     uri: http://localhost:8082
     predicates:
       - Path=/api/doctor/**
   ```

2. **Xóa các file mock/duplicate:**
   - `src/utils/doctors.js`
   - `src/pages/Dashboard.jsx` (giữ user/Dashboard.jsx)
   - `src/pages/DoctorPage.jsx` (giữ doctor/DoctorDetail.jsx)
   - `src/pages/BookingPage.jsx` (giữ booking/BookingPage.jsx)
   - `src/pages/Profile.jsx` (giữ user/Profile.jsx)

3. **Sửa các API call bypass gateway:**
   - Thay tất cả `localhost:8081`, `localhost:8083` bằng sử dụng `axiosConfig.js`

### Ưu tiên 2 (Tuần này):

4. **Xóa mock fallback data** trong catch blocks, thay bằng UI error state
5. **Thống nhất token storage** - sử dụng localStorage (như axiosConfig đang dùng)
6. **Fix doctorApi.js endpoints** để match với backend routes

### Ưu tiên 3 (Tùy chọn):

7. Xóa console.log debug
8. Xóa import không sử dụng
9. Thống nhất dark mode implementation

---

## 📁 FILES CẦN SỬA

```
frontend-web/src/
├── api/
│   └── doctorApi.js          ← Fix endpoint paths
├── pages/
│   ├── Dashboard.jsx         ← XÓA (duplicate)
│   ├── DoctorPage.jsx        ← XÓA (duplicate)  
│   ├── BookingPage.jsx       ← XÓA (duplicate)
│   ├── Profile.jsx           ← XÓA (duplicate)
│   ├── AuthPage.jsx          ← Fix API URL
│   └── CreateDoctorAcc.jsx   ← Fix API URL
├── components/
│   └── admin/
│       └── AdminDoctorRequest.jsx ← Fix API URL
└── utils/
    └── doctors.js            ← XÓA (mock data)

api-gateway/src/main/resources/
└── application-dev.yml       ← Thêm routes cho doctor, patient, appointment
```

---

## 🎯 KẾT LUẬN

Frontend hiện tại có **2 lớp code song song**:
1. **Old code** (mock data, bypass gateway) - không nên sử dụng
2. **New code** (API-based, qua gateway) - đang được sử dụng trong App.jsx

Vấn đề chính là:
1. API Gateway **thiếu routes** cho nhiều services
2. Một số code vẫn **bypass gateway** 
3. Mock data vẫn còn tồn tại và có thể gây nhầm lẫn

Sau khi fix các vấn đề ưu tiên 1, hệ thống sẽ hoạt động đúng với backend và database.
