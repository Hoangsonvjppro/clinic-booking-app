/*
 * Lớp UpdateUserRolesRequest là Data Transfer Object (DTO) được dùng để nhận dữ liệu
 * từ phía client khi quản trị viên muốn cập nhật danh sách vai trò (roles)
 * của một người dùng cụ thể trong hệ thống.
 *
 * Cấu trúc ví dụ của JSON request:
 * {
 *   "email": "doctor@example.com",
 *   "roleNames": ["DOCTOR", "ADMIN"]
 * }
 *
 * Các annotation validation giúp đảm bảo dữ liệu đầu vào hợp lệ:
 *  - @NotBlank: email không được để trống hoặc chỉ chứa khoảng trắng.
 *  - @Email: đảm bảo định dạng email hợp lệ.
 *  - @NotEmpty: danh sách roleNames phải có ít nhất một phần tử.
 *
 * Lớp này được dùng ở tầng controller trước khi truyền vào RoleService để xử lý nghiệp vụ.
 */
package com.clinic.auth.web.dto;

import jakarta.validation.constraints.Email;     // Xác thực định dạng email
import jakarta.validation.constraints.NotBlank;  // Không cho phép chuỗi rỗng/null
import jakarta.validation.constraints.NotEmpty;  // Không cho phép danh sách rỗng
import lombok.Data;                              // Lombok sinh getter/setter/toString/hashCode tự động

import java.util.Set; // Dùng Set để tránh trùng lặp vai trò

@Data
public class UpdateUserRolesRequest {

    /**
     * Địa chỉ email của người dùng cần cập nhật vai trò. 
     * Phải là email hợp lệ và không được để trống.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    /**
     * Danh sách các tên vai trò mới sẽ gán cho người dùng.
     * Phải có ít nhất một phần tử, ví dụ: ["ADMIN", "PATIENT"].
     */
    @NotEmpty(message = "Roles list cannot be empty")
    private Set<String> roleNames;
}
