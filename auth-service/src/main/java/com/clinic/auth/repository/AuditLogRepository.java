/*
 * Repository này chịu trách nhiệm thao tác với bảng `audit_logs` trong cơ sở dữ liệu.
 * Đây là nơi lưu trữ các bản ghi audit do hệ thống tạo ra mỗi khi người dùng hoặc service
 * thực hiện một hành động quan trọng (ví dụ: đăng nhập, thay đổi mật khẩu, chỉnh sửa dữ liệu, ...).
 *
 * AuditLogRepository kế thừa JpaRepository, vì vậy nó đã có sẵn đầy đủ các phương thức CRUD:
 * - save(AuditLog log): lưu bản ghi mới
 * - findAll(): truy xuất toàn bộ bản ghi
 * - findById(Long id): tìm bản ghi theo ID
 * - deleteById(Long id): xóa bản ghi theo ID
 *
 * Trong tương lai, ta có thể mở rộng thêm các truy vấn tuỳ chỉnh (custom query) để phục vụ báo cáo,
 * phân tích hành vi người dùng, hoặc tìm kiếm các sự kiện cụ thể (theo userId, action, khoảng thời gian, v.v.).
 */
package com.clinic.auth.repository;

import com.clinic.auth.model.AuditLog; // Thực thể ánh xạ bảng audit_logs
import org.springframework.data.jpa.repository.JpaRepository; // Giao diện cung cấp CRUD cho entity

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // Có thể thêm các truy vấn tùy chỉnh, ví dụ:
    // List<AuditLog> findByUserId(Long userId);
    // List<AuditLog> findByActionAndStatus(String action, String status);
}
