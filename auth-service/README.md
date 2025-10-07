# 🧩 Auth Service — Clinic Booking App

Dịch vụ xác thực người dùng cho hệ thống **clinic-booking-app**, xây dựng bằng **Spring Boot 3.3.4 + Java 21 + PostgreSQL**.

---

## 🚀 Chức năng
- Đăng ký / Đăng nhập bằng email & mật khẩu.
- Cấp JWT access token, refresh token.
- Quên mật khẩu / gửi email đặt lại.
- Phân quyền theo `Role` (ADMIN, DOCTOR, PATIENT).
- Audit log mọi thao tác (`@Async`).
- Triển khai container hóa với Docker & Docker Compose.

---

## ⚙️ Cấu trúc thư mục

src/main/java/com/clinic/auth
┣ model/ # Entity, DTO
┣ repo/ # Repository layer
┣ service/ # Business logic (Auth, User, Email, Role)
┣ web/ # REST Controller
┣ security/ # JWT, Filter, SecurityConfig
┣ audit/ # Logging & AOP
┗ AuthServiceApplication.java


---

## 🧠 Luồng xử lý chính

1. **/api/v1/auth/register** → tạo user, mã hóa mật khẩu.
2. **/api/v1/auth/login** → xác thực, sinh access + refresh token.
3. **/api/v1/auth/me** → trả về thông tin user theo token.
4. **/api/v1/roles** → thêm/xóa/sửa role (ADMIN).
5. **/api/v1/auth/forgot-password** → gửi email đặt lại mật khẩu (`@Async`).

---

## 🧩 Environment cần thiết

| Biến | Giá trị mặc định | Ghi chú |
|------|------------------|--------|
| DB_URL | jdbc:postgresql://postgres:5432/clinic_auth | |
| DB_USERNAME | postgres | |
| DB_PASSWORD | postgres | |
| JWT_SECRET | change-me-please-change-me-please | ≥ 32 ký tự |
| CORS_ALLOWED_ORIGINS | http://localhost:3000 | |
| MAIL_HOST | smtp.gmail.com | |
| MAIL_PORT | 587 | |
| MAIL_USERNAME | – | |
| MAIL_PASSWORD | – | |
| MAIL_FROM | no-reply@clinic.com | |

---

## 🐳 Docker Compose
```bash
docker compose up -d --build
App sẽ chạy ở http://localhost:8081