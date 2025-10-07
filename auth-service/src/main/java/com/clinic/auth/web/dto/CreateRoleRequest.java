/*
 * Lớp CreateRoleRequest là một Data Transfer Object (DTO) được sử dụng để nhận dữ liệu
 * từ client khi tạo mới một vai trò (Role) trong hệ thống.
 * Nó giúp tách biệt phần dữ liệu đầu vào của API khỏi lớp thực thể (Entity) Role,
 * tránh việc ánh xạ trực tiếp giữa tầng controller và cơ sở dữ liệu.
 *
 * Cấu trúc JSON điển hình mà client gửi đến API có dạng:
 * {
 *   "name": "DOCTOR",
 *   "description": "Role assigned to registered doctors"
 * }
 *
 * Ràng buộc dữ liệu:
 *  - @NotBlank: Tên vai trò bắt buộc không được để trống.
 *  - @Pattern: Chỉ cho phép chữ in hoa và dấu gạch dưới (ví dụ: ADMIN, PATIENT_SERVICE).
 *  - description: không bắt buộc, dùng để mô tả vai trò.
 *
 * Lớp này giúp đảm bảo dữ liệu đầu vào hợp lệ trước khi đến tầng service và được lưu xuống cơ sở dữ liệu.
 */
package com.clinic.auth.web.dto;

import jakarta.validation.constraints.NotBlank; // Kiểm tra chuỗi không rỗng/null
import jakarta.validation.constraints.Pattern; // Ràng buộc định dạng ký tự
import lombok.Data;                            // Lombok sinh getter/setter/toString tự động

@Data
public class CreateRoleRequest {

    /**
     * Tên vai trò — phải viết HOA và chỉ chứa chữ cái hoặc dấu gạch dưới (ví dụ: ADMIN, DOCTOR, PATIENT).
     */
    @NotBlank(message = "Role name is required")
    @Pattern(regexp = "^[A-Z_]+$", message = "Role name must be uppercase letters and underscores only")
    private String name;

    /**
     * Mô tả vai trò (tuỳ chọn), có thể dùng để hiển thị trong giao diện quản trị hoặc log hệ thống.
     */
    private String description;
}
