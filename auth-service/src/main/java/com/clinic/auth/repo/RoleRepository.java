/*
 * Repository này cung cấp các thao tác truy vấn dữ liệu cho bảng `roles` — nơi lưu trữ thông tin
 * về các vai trò (quyền hạn) trong hệ thống, như ADMIN, DOCTOR, PATIENT, v.v.
 *
 * RoleRepository kế thừa từ JpaRepository, cho phép sử dụng toàn bộ CRUD mặc định của Spring Data JPA.
 * Ngoài ra, hai phương thức tuỳ chỉnh được định nghĩa để phục vụ các nhu cầu thường gặp:
 *
 * - existsByName(String name): kiểm tra nhanh xem một vai trò đã tồn tại trong hệ thống chưa.
 * - findByName(String name): tìm kiếm vai trò theo tên, trả về Optional để tránh lỗi null.
 *
 * Repository này thường được sử dụng trong các luồng khởi tạo dữ liệu (seed), đăng ký người dùng,
 * hoặc khi gán quyền cho tài khoản.
 */
package com.clinic.auth.repo;

import com.clinic.auth.model.Role; // Thực thể ánh xạ bảng roles
import org.springframework.data.jpa.repository.JpaRepository; // Giao diện CRUD cho entity

import java.util.Optional; // Kiểu trả về an toàn null

public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Kiểm tra xem vai trò với tên cho trước đã tồn tại trong cơ sở dữ liệu hay chưa.
     *
     * @param name Tên vai trò (ví dụ: ADMIN, DOCTOR, PATIENT)
     * @return true nếu vai trò đã tồn tại, false nếu chưa
     */
    boolean existsByName(String name);

    /**
     * Tìm vai trò theo tên.
     *
     * @param name Tên vai trò cần tìm
     * @return Optional chứa Role nếu tìm thấy, ngược lại là rỗng
     */
    Optional<Role> findByName(String name);
}
