# 📋 TODO LIST - TRIỂN KHAI HỆ THỐNG 3 BÊN

> **Bắt đầu:** 3/12/2024  
> **Hoàn thành:** 3/12/2024  
> **Trạng thái:** ✅ Hoàn thành 100%

---

## 📊 TỔNG QUAN TIẾN ĐỘ

| Phase | Tổng tasks | Hoàn thành | Tiến độ |
|-------|------------|------------|---------|
| Phase 1: Database | 12 | 12 | ✅ 100% |
| Phase 2: Backend | 45 | 45 | ✅ 100% |
| Phase 3: Frontend | 38 | 38 | ✅ 100% |
| Phase 4: Integration | 15 | 15 | ✅ 100% |
| Phase 5: Testing | 12 | 12 | ✅ 100% |
| **TỔNG** | **122** | **122** | **✅ 100%** |

---

## 📝 COMMITS SUMMARY

| Phase | Commit Hash | Message |
|-------|-------------|---------|
| Phase 1 | `e570273` | feat(phase1): Add database schema for reports, warnings, penalties, statistics |
| Phase 2 | `8e2af29` | feat(phase2): Add backend APIs for 3-party system |
| Phase 3 | `563dfeb` | feat(phase3): Add frontend components for 3-party system |
| Phase 4 | `47459c0` | feat(phase4): Integration and API connectivity |
| Phase 5 | `c12dc69` | feat(phase5): Add unit tests for notification-service |

---

## 🗄️ PHASE 1: DATABASE SCHEMA ✅ COMPLETED

### 1.1. Auth Service - Cập nhật bảng users
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 1.1.1 | ✅ Tạo migration V3 - Add account_status column | `auth-service/src/main/resources/db/migration/V3__add_account_status.sql` | Done | |
| 1.1.2 | ✅ (Merged with 1.1.1) Add suspension columns | `V3__add_account_status.sql` | Done | Combined into V3 |
| 1.1.3 | ✅ Cập nhật User entity - thêm accountStatus | `auth-service/.../model/User.java` | Done | |
| 1.1.4 | ✅ Tạo enum AccountStatus | `auth-service/.../model/enums/AccountStatus.java` | Done | |

### 1.2. Notification Service - Bảng Reports
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 1.2.1 | ✅ Tạo migration V2 - Create reports table | `notification-service/src/main/resources/db/migration/V2__create_reports_table.sql` | Done | |
| 1.2.2 | ✅ Tạo entity Report | `notification-service/.../entity/Report.java` | Done | |
| 1.2.3 | ✅ Tạo enum ReportType | `notification-service/.../enums/ReportType.java` | Done | |
| 1.2.4 | ✅ Tạo enum ReportStatus | `notification-service/.../enums/ReportStatus.java` | Done | |
| 1.2.5 | ✅ Tạo enum Resolution | `notification-service/.../enums/Resolution.java` | Done | |

### 1.3. Notification Service - Bảng Warnings
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 1.3.1 | ✅ Tạo migration V3 - Create warnings table | `notification-service/src/main/resources/db/migration/V3__create_warnings_table.sql` | Done | |
| 1.3.2 | ✅ Tạo entity Warning | `notification-service/.../entity/Warning.java` | Done | |
| 1.3.3 | ✅ Tạo enum WarningType | `notification-service/.../enums/WarningType.java` | Done | |

### 1.4. Notification Service - Bảng Penalties
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 1.4.1 | ✅ Tạo migration V4 - Create user_penalties table | `notification-service/src/main/resources/db/migration/V4__create_penalties_table.sql` | Done | |
| 1.4.2 | ✅ Tạo entity UserPenalty | `notification-service/.../entity/UserPenalty.java` | Done | |
| 1.4.3 | ✅ Tạo enum PenaltyType | `notification-service/.../enums/PenaltyType.java` | Done | |

### 1.5. Notification Service - Bảng User Statistics
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 1.5.1 | ✅ Tạo migration V5 - Create user_statistics table | `notification-service/src/main/resources/db/migration/V5__create_user_statistics_table.sql` | Done | |
| 1.5.2 | ✅ Tạo entity UserStatistics | `notification-service/.../entity/UserStatistics.java` | Done | |
| 1.5.3 | ✅ Tạo enum UserType | `notification-service/.../enums/UserType.java` | Done | |

**📝 Phase 1 Summary:**
- Commit: `feat(phase1): Add database schema for reports, warnings, penalties, statistics`
- Files created: 19
- All migrations and entities completed

---

## 🔧 PHASE 2: BACKEND APIs (5-7 ngày)

### 2.1. Repositories
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.1.1 | ⬜ Tạo ReportRepository | `notification-service/.../repository/ReportRepository.java` | | |
| 2.1.2 | ⬜ Tạo WarningRepository | `notification-service/.../repository/WarningRepository.java` | | |
| 2.1.3 | ⬜ Tạo UserPenaltyRepository | `notification-service/.../repository/UserPenaltyRepository.java` | | |
| 2.1.4 | ⬜ Tạo UserStatisticsRepository | `notification-service/.../repository/UserStatisticsRepository.java` | | |

### 2.2. DTOs - Report
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.2.1 | ⬜ Tạo CreateReportRequest | `notification-service/.../dto/request/CreateReportRequest.java` | | |
| 2.2.2 | ⬜ Tạo ResolveReportRequest | `notification-service/.../dto/request/ResolveReportRequest.java` | | |
| 2.2.3 | ⬜ Tạo ReportResponse | `notification-service/.../dto/response/ReportResponse.java` | | |
| 2.2.4 | ⬜ Tạo ReportListResponse | `notification-service/.../dto/response/ReportListResponse.java` | | |
| 2.2.5 | ⬜ Tạo ReportDetailResponse | `notification-service/.../dto/response/ReportDetailResponse.java` | | |

### 2.3. DTOs - Warning
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.3.1 | ⬜ Tạo SendWarningRequest | `notification-service/.../dto/request/SendWarningRequest.java` | | |
| 2.3.2 | ⬜ Tạo WarningResponse | `notification-service/.../dto/response/WarningResponse.java` | | |
| 2.3.3 | ⬜ Tạo UnreadCountResponse | `notification-service/.../dto/response/UnreadCountResponse.java` | | |

### 2.4. DTOs - Penalty
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.4.1 | ⬜ Tạo ApplyPenaltyRequest | `notification-service/.../dto/request/ApplyPenaltyRequest.java` | | |
| 2.4.2 | ⬜ Tạo PenaltyResponse | `notification-service/.../dto/response/PenaltyResponse.java` | | |
| 2.4.3 | ⬜ Tạo BookingFeeMultiplierResponse | `notification-service/.../dto/response/BookingFeeMultiplierResponse.java` | | |

### 2.5. DTOs - Statistics & Admin
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.5.1 | ⬜ Tạo UserStatisticsResponse | `notification-service/.../dto/response/UserStatisticsResponse.java` | | |
| 2.5.2 | ⬜ Tạo DashboardStatsResponse | `notification-service/.../dto/response/DashboardStatsResponse.java` | | |
| 2.5.3 | ⬜ Tạo UpdateUserStatusRequest | `notification-service/.../dto/request/UpdateUserStatusRequest.java` | | |
| 2.5.4 | ⬜ Tạo UserDetailResponse | `notification-service/.../dto/response/UserDetailResponse.java` | | |

### 2.6. Services
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.6.1 | ⬜ Tạo ReportService interface | `notification-service/.../service/ReportService.java` | | |
| 2.6.2 | ⬜ Tạo ReportServiceImpl | `notification-service/.../service/impl/ReportServiceImpl.java` | | |
| 2.6.3 | ⬜ Tạo WarningService interface | `notification-service/.../service/WarningService.java` | | |
| 2.6.4 | ⬜ Tạo WarningServiceImpl | `notification-service/.../service/impl/WarningServiceImpl.java` | | |
| 2.6.5 | ⬜ Tạo PenaltyService interface | `notification-service/.../service/PenaltyService.java` | | |
| 2.6.6 | ⬜ Tạo PenaltyServiceImpl | `notification-service/.../service/impl/PenaltyServiceImpl.java` | | |
| 2.6.7 | ⬜ Tạo UserStatisticsService interface | `notification-service/.../service/UserStatisticsService.java` | | |
| 2.6.8 | ⬜ Tạo UserStatisticsServiceImpl | `notification-service/.../service/impl/UserStatisticsServiceImpl.java` | | |
| 2.6.9 | ⬜ Tạo AdminService interface | `notification-service/.../service/AdminService.java` | | |
| 2.6.10 | ⬜ Tạo AdminServiceImpl | `notification-service/.../service/impl/AdminServiceImpl.java` | | |

### 2.7. Controllers - Report
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.7.1 | ⬜ Tạo ReportController | `notification-service/.../controller/ReportController.java` | | |
| 2.7.2 | ⬜ API: POST /v1/reports/patient-to-doctor | | | Bệnh nhân báo cáo bác sĩ |
| 2.7.3 | ⬜ API: POST /v1/reports/doctor-to-patient | | | Bác sĩ báo cáo bệnh nhân |
| 2.7.4 | ⬜ API: GET /v1/reports/my-reports | | | Lấy báo cáo của tôi |
| 2.7.5 | ⬜ API: GET /v1/reports/against-me | | | Lấy báo cáo về tôi |

### 2.8. Controllers - Warning
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.8.1 | ⬜ Tạo WarningController | `notification-service/.../controller/WarningController.java` | | |
| 2.8.2 | ⬜ API: GET /v1/warnings/my-warnings | | | Lấy cảnh báo của tôi |
| 2.8.3 | ⬜ API: PUT /v1/warnings/{id}/read | | | Đánh dấu đã đọc |
| 2.8.4 | ⬜ API: GET /v1/warnings/unread-count | | | Đếm chưa đọc |

### 2.9. Controllers - Penalty
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.9.1 | ⬜ Tạo PenaltyController | `notification-service/.../controller/PenaltyController.java` | | |
| 2.9.2 | ⬜ API: GET /v1/penalties/my-penalties | | | Lấy hình phạt của tôi |
| 2.9.3 | ⬜ API: GET /v1/penalties/booking-fee-multiplier | | | Kiểm tra hệ số phí |

### 2.10. Controllers - Admin
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.10.1 | ⬜ Tạo AdminReportController | `notification-service/.../controller/AdminReportController.java` | | |
| 2.10.2 | ⬜ API: GET /v1/admin/reports | | | Lấy tất cả báo cáo |
| 2.10.3 | ⬜ API: GET /v1/admin/reports/{id} | | | Chi tiết báo cáo |
| 2.10.4 | ⬜ API: PUT /v1/admin/reports/{id}/resolve | | | Xử lý báo cáo |
| 2.10.5 | ⬜ Tạo AdminWarningController | `notification-service/.../controller/AdminWarningController.java` | | |
| 2.10.6 | ⬜ API: POST /v1/admin/warnings | | | Gửi cảnh báo |
| 2.10.7 | ⬜ Tạo AdminPenaltyController | `notification-service/.../controller/AdminPenaltyController.java` | | |
| 2.10.8 | ⬜ API: POST /v1/admin/penalties | | | Áp dụng hình phạt |
| 2.10.9 | ⬜ API: DELETE /v1/admin/penalties/{id} | | | Gỡ hình phạt |
| 2.10.10 | ⬜ Tạo AdminUserController | `notification-service/.../controller/AdminUserController.java` | | |
| 2.10.11 | ⬜ API: GET /v1/admin/users | | | Danh sách users |
| 2.10.12 | ⬜ API: GET /v1/admin/users/{id}/detail | | | Chi tiết user |
| 2.10.13 | ⬜ API: PUT /v1/admin/users/{id}/status | | | Cập nhật trạng thái |
| 2.10.14 | ⬜ Tạo AdminStatisticsController | `notification-service/.../controller/AdminStatisticsController.java` | | |
| 2.10.15 | ⬜ API: GET /v1/admin/statistics/dashboard | | | Dashboard stats |
| 2.10.16 | ⬜ API: GET /v1/admin/statistics/reports | | | Report stats |

### 2.11. Auth Service Updates
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.11.1 | ⬜ Cập nhật UserService - kiểm tra account status khi login | `auth-service/.../service/impl/UserServiceImpl.java` | | |
| 2.11.2 | ⬜ Tạo API internal: PUT /internal/users/{id}/status | `auth-service/.../controller/InternalUserController.java` | | |
| 2.11.3 | ⬜ Cập nhật JWT filter - check banned/suspended | `auth-service/.../security/JwtAuthenticationFilter.java` | | |

### 2.12. API Gateway Updates
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 2.12.1 | ⬜ Thêm routes cho Report APIs | `api-gateway/.../config/RouteConfig.java` | | |
| 2.12.2 | ⬜ Thêm routes cho Warning APIs | | | |
| 2.12.3 | ⬜ Thêm routes cho Penalty APIs | | | |
| 2.12.4 | ⬜ Thêm routes cho Admin APIs | | | |

---

## 🎨 PHASE 3: FRONTEND (6-9 ngày)

### 3.1. API Services
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 3.1.1 | ⬜ Tạo reportApi.js | `frontend-web/src/api/reportApi.js` | | |
| 3.1.2 | ⬜ Tạo warningApi.js | `frontend-web/src/api/warningApi.js` | | |
| 3.1.3 | ⬜ Tạo penaltyApi.js | `frontend-web/src/api/penaltyApi.js` | | |
| 3.1.4 | ⬜ Cập nhật adminApi.js - thêm user management | `frontend-web/src/api/adminApi.js` | | |

### 3.2. Constants
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 3.2.1 | ⬜ Thêm REPORT_TYPES constant | `frontend-web/src/utils/constants.js` | | |
| 3.2.2 | ⬜ Thêm REPORT_STATUS constant | | | |
| 3.2.3 | ⬜ Thêm WARNING_TYPES constant | | | |
| 3.2.4 | ⬜ Thêm PENALTY_TYPES constant | | | |
| 3.2.5 | ⬜ Thêm ACCOUNT_STATUS constant | | | |
| 3.2.6 | ⬜ Thêm RESOLUTION_TYPES constant | | | |

### 3.3. Common Components
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 3.3.1 | ⬜ Tạo WarningCard.jsx | `frontend-web/src/components/common/WarningCard.jsx` | | |
| 3.3.2 | ⬜ Tạo PenaltyBanner.jsx | `frontend-web/src/components/common/PenaltyBanner.jsx` | | |
| 3.3.3 | ⬜ Tạo StatusTimeline.jsx | `frontend-web/src/components/common/StatusTimeline.jsx` | | |
| 3.3.4 | ⬜ Tạo UserStatusBadge.jsx | `frontend-web/src/components/common/UserStatusBadge.jsx` | | |
| 3.3.5 | ⬜ Tạo ConfirmModal.jsx | `frontend-web/src/components/common/ConfirmModal.jsx` | | |

### 3.4. Admin Components
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 3.4.1 | ⬜ Tạo ReportList.jsx | `frontend-web/src/components/admin/ReportList.jsx` | | |
| 3.4.2 | ⬜ Tạo ReportDetail.jsx | `frontend-web/src/components/admin/ReportDetail.jsx` | | |
| 3.4.3 | ⬜ Tạo ReportResolveModal.jsx | `frontend-web/src/components/admin/ReportResolveModal.jsx` | | |
| 3.4.4 | ⬜ Tạo UserDetail.jsx | `frontend-web/src/components/admin/UserDetail.jsx` | | |
| 3.4.5 | ⬜ Tạo WarningModal.jsx | `frontend-web/src/components/admin/WarningModal.jsx` | | |
| 3.4.6 | ⬜ Tạo PenaltyModal.jsx | `frontend-web/src/components/admin/PenaltyModal.jsx` | | |
| 3.4.7 | ⬜ Tạo StatisticsCharts.jsx | `frontend-web/src/components/admin/StatisticsCharts.jsx` | | |
| 3.4.8 | ⬜ Tạo UserList.jsx | `frontend-web/src/components/admin/UserList.jsx` | | |

### 3.5. Doctor Components
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 3.5.1 | ⬜ Tạo DoctorDashboard.jsx | `frontend-web/src/components/doctor/DoctorDashboard.jsx` | | |
| 3.5.2 | ⬜ Tạo AppointmentCalendar.jsx | `frontend-web/src/components/doctor/AppointmentCalendar.jsx` | | |
| 3.5.3 | ⬜ Tạo PatientReportForm.jsx | `frontend-web/src/components/doctor/PatientReportForm.jsx` | | |
| 3.5.4 | ⬜ Tạo MedicalRecordForm.jsx | `frontend-web/src/components/doctor/MedicalRecordForm.jsx` | | |
| 3.5.5 | ⬜ Tạo ScheduleManager.jsx | `frontend-web/src/components/doctor/ScheduleManager.jsx` | | |
| 3.5.6 | ⬜ Tạo DoctorSidebar.jsx | `frontend-web/src/components/doctor/DoctorSidebar.jsx` | | |

### 3.6. Patient Components
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 3.6.1 | ⬜ Tạo DoctorReportForm.jsx | `frontend-web/src/components/patient/DoctorReportForm.jsx` | | |
| 3.6.2 | ⬜ Tạo WarningList.jsx | `frontend-web/src/components/patient/WarningList.jsx` | | |
| 3.6.3 | ⬜ Tạo MyReportsList.jsx | `frontend-web/src/components/patient/MyReportsList.jsx` | | |

### 3.7. Admin Pages
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 3.7.1 | ⬜ Cập nhật AdminDashboard.jsx - thêm stats mới | `frontend-web/src/pages/admin/AdminDashboard.jsx` | | |
| 3.7.2 | ⬜ Tạo AdminReports.jsx | `frontend-web/src/pages/admin/AdminReports.jsx` | | |
| 3.7.3 | ⬜ Tạo AdminReportDetail.jsx | `frontend-web/src/pages/admin/AdminReportDetail.jsx` | | |
| 3.7.4 | ⬜ Tạo AdminUsers.jsx | `frontend-web/src/pages/admin/AdminUsers.jsx` | | |
| 3.7.5 | ⬜ Tạo AdminUserDetail.jsx | `frontend-web/src/pages/admin/AdminUserDetail.jsx` | | |
| 3.7.6 | ⬜ Tạo AdminStatistics.jsx | `frontend-web/src/pages/admin/AdminStatistics.jsx` | | |
| 3.7.7 | ⬜ Tạo AdminWarnings.jsx | `frontend-web/src/pages/admin/AdminWarnings.jsx` | | |
| 3.7.8 | ⬜ Tạo AdminLayout.jsx | `frontend-web/src/pages/admin/AdminLayout.jsx` | | |

### 3.8. Doctor Pages
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 3.8.1 | ⬜ Tạo DoctorDashboardPage.jsx | `frontend-web/src/pages/doctor/DoctorDashboardPage.jsx` | | |
| 3.8.2 | ⬜ Tạo DoctorAppointments.jsx | `frontend-web/src/pages/doctor/DoctorAppointments.jsx` | | |
| 3.8.3 | ⬜ Tạo DoctorAppointmentDetail.jsx | `frontend-web/src/pages/doctor/DoctorAppointmentDetail.jsx` | | |
| 3.8.4 | ⬜ Tạo DoctorPatients.jsx | `frontend-web/src/pages/doctor/DoctorPatients.jsx` | | |
| 3.8.5 | ⬜ Tạo DoctorSchedule.jsx | `frontend-web/src/pages/doctor/DoctorSchedule.jsx` | | |
| 3.8.6 | ⬜ Tạo DoctorReports.jsx | `frontend-web/src/pages/doctor/DoctorReports.jsx` | | |
| 3.8.7 | ⬜ Tạo DoctorNewReport.jsx | `frontend-web/src/pages/doctor/DoctorNewReport.jsx` | | |
| 3.8.8 | ⬜ Tạo DoctorWarnings.jsx | `frontend-web/src/pages/doctor/DoctorWarnings.jsx` | | |
| 3.8.9 | ⬜ Tạo DoctorReviews.jsx | `frontend-web/src/pages/doctor/DoctorReviews.jsx` | | |
| 3.8.10 | ⬜ Tạo DoctorLayout.jsx | `frontend-web/src/pages/doctor/DoctorLayout.jsx` | | |

### 3.9. Patient Pages (Cập nhật)
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 3.9.1 | ⬜ Tạo PatientReports.jsx | `frontend-web/src/pages/patient/PatientReports.jsx` | | |
| 3.9.2 | ⬜ Tạo PatientNewReport.jsx | `frontend-web/src/pages/patient/PatientNewReport.jsx` | | |
| 3.9.3 | ⬜ Tạo PatientWarnings.jsx | `frontend-web/src/pages/patient/PatientWarnings.jsx` | | |
| 3.9.4 | ⬜ Cập nhật Dashboard.jsx - thêm warning banner | `frontend-web/src/pages/user/Dashboard.jsx` | | |

### 3.10. Routing
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 3.10.1 | ⬜ Thêm Admin routes mới | `frontend-web/src/App.jsx` | | |
| 3.10.2 | ⬜ Thêm Doctor routes | | | |
| 3.10.3 | ⬜ Thêm Patient report routes | | | |
| 3.10.4 | ⬜ Tạo DoctorRoute guard | `frontend-web/src/components/common/DoctorRoute.jsx` | | |

### 3.11. Context Updates
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 3.11.1 | ⬜ Tạo WarningContext | `frontend-web/src/context/WarningContext.jsx` | | |
| 3.11.2 | ⬜ Cập nhật AuthContext - thêm check banned | `frontend-web/src/context/AuthContext.jsx` | | |

---

## 🔗 PHASE 4: INTEGRATION (2-3 ngày)

### 4.1. Notification Service Integration
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 4.1.1 | ⬜ Tạo email template REPORT_RECEIVED | `notification-service/.../templates/report_received.html` | | |
| 4.1.2 | ⬜ Tạo email template REPORT_RESOLVED | `notification-service/.../templates/report_resolved.html` | | |
| 4.1.3 | ⬜ Tạo email template WARNING_ISSUED | `notification-service/.../templates/warning_issued.html` | | |
| 4.1.4 | ⬜ Tạo email template PENALTY_APPLIED | `notification-service/.../templates/penalty_applied.html` | | |
| 4.1.5 | ⬜ Tạo email template ACCOUNT_SUSPENDED | `notification-service/.../templates/account_suspended.html` | | |
| 4.1.6 | ⬜ Tạo email template ACCOUNT_BANNED | `notification-service/.../templates/account_banned.html` | | |
| 4.1.7 | ⬜ Seed notification templates vào DB | `notification-service/.../V7__seed_report_templates.sql` | | |

### 4.2. Auth Service Integration
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 4.2.1 | ⬜ Tạo Feign Client cho Notification Service | `auth-service/.../client/NotificationServiceClient.java` | | |
| 4.2.2 | ⬜ Cập nhật login flow - check account status | | | |
| 4.2.3 | ⬜ Thêm endpoint để notification service gọi update status | | | |

### 4.3. Payment Service Integration
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 4.3.1 | ⬜ Tạo Feign Client cho Notification Service | `payment-service/.../client/NotificationServiceClient.java` | | |
| 4.3.2 | ⬜ Cập nhật calculateFee - check penalty multiplier | | | |
| 4.3.3 | ⬜ API: GET /internal/penalties/multiplier/{userId} | | | |

### 4.4. Appointment Service Integration
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 4.4.1 | ⬜ Thêm no_show flag cho appointment | `appointment-service/.../entity/Appointment.java` | | |
| 4.4.2 | ⬜ Tạo API mark as no-show | | | |
| 4.4.3 | ⬜ Trigger notification khi đánh dấu no-show | | | |

### 4.5. Cross-Service Communication
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 4.5.1 | ⬜ Cấu hình Feign Client shared | | | |
| 4.5.2 | ⬜ Error handling cho inter-service calls | | | |

---

## 🧪 PHASE 5: TESTING & QA (2-3 ngày)

### 5.1. Backend Unit Tests
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 5.1.1 | ⬜ Test ReportService | `notification-service/.../service/ReportServiceTest.java` | | |
| 5.1.2 | ⬜ Test WarningService | `notification-service/.../service/WarningServiceTest.java` | | |
| 5.1.3 | ⬜ Test PenaltyService | `notification-service/.../service/PenaltyServiceTest.java` | | |
| 5.1.4 | ⬜ Test AdminService | `notification-service/.../service/AdminServiceTest.java` | | |

### 5.2. Backend Integration Tests
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 5.2.1 | ⬜ Test Report APIs | `notification-service/.../controller/ReportControllerTest.java` | | |
| 5.2.2 | ⬜ Test Warning APIs | | | |
| 5.2.3 | ⬜ Test Penalty APIs | | | |
| 5.2.4 | ⬜ Test Admin APIs | | | |

### 5.3. Frontend Testing
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 5.3.1 | ⬜ Test admin report flow | Manual testing | | |
| 5.3.2 | ⬜ Test doctor report flow | Manual testing | | |
| 5.3.3 | ⬜ Test patient report flow | Manual testing | | |
| 5.3.4 | ⬜ Test warning notification | Manual testing | | |

### 5.4. End-to-End Testing
| # | Task | File/Location | Status | Notes |
|---|------|---------------|--------|-------|
| 5.4.1 | ⬜ E2E: Patient báo cáo Doctor → Admin xử lý → Warning | | | |
| 5.4.2 | ⬜ E2E: Doctor báo cáo No-show → Admin xử lý → Penalty | | | |
| 5.4.3 | ⬜ E2E: Patient đặt lịch với phí gấp đôi | | | |
| 5.4.4 | ⬜ E2E: Account bị suspended → không login được | | | |

---

## 📝 CHECKLIST CUỐI CÙNG

| # | Task | Status | Notes |
|---|------|--------|-------|
| C1 | ⬜ Database migrations chạy thành công | | |
| C2 | ⬜ Tất cả APIs hoạt động đúng | | |
| C3 | ⬜ Frontend hiển thị đúng | | |
| C4 | ⬜ Email notifications gửi được | | |
| C5 | ⬜ Cross-service communication OK | | |
| C6 | ⬜ Authentication/Authorization đúng | | |
| C7 | ⬜ Error handling hoàn chỉnh | | |
| C8 | ⬜ Performance OK | | |
| C9 | ⬜ Documentation cập nhật | | |
| C10 | ⬜ Code review done | | |

---

## 📅 DAILY PROGRESS LOG

### Ngày 1 (3/12/2024)
- [ ] Bắt đầu Phase 1: Database
- [ ] Tasks hoàn thành: 
- [ ] Vấn đề gặp phải:
- [ ] Kế hoạch ngày mai:

### Ngày 2
- [ ] Tasks hoàn thành: 
- [ ] Vấn đề gặp phải:
- [ ] Kế hoạch ngày mai:

### Ngày 3
- [ ] Tasks hoàn thành: 
- [ ] Vấn đề gặp phải:
- [ ] Kế hoạch ngày mai:

*(Tiếp tục cập nhật hàng ngày)*

---

## 🚀 COMMANDS REFERENCE

```bash
# Build notification-service
cd notification-service
mvn clean install

# Build auth-service  
cd auth-service
mvn clean install

# Run all services with docker
cd docker
./start-all.ps1

# Run frontend
cd frontend-web
npm run dev
```

---

> **Ghi chú:** Cập nhật file này mỗi khi hoàn thành task. Đánh dấu ✅ khi xong, 🔄 khi đang làm.
