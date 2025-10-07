/*
 * Lớp ChangePasswordRequest là một Data Transfer Object (DTO) được sử dụng để nhận dữ liệu
 * từ phía client khi người dùng muốn thay đổi mật khẩu của mình.
 *
 * Cấu trúc này thường được truyền dưới dạng JSON trong body của HTTP request đến API đổi mật khẩu.
 * Ví dụ:
 * {
 *   "currentPassword": "OldPass123!",
 *   "newPassword": "NewPass456@",
 *   "confirmPassword": "NewPass456@"
 * }
 *
 * Các annotation của Jakarta Validation được sử dụng để kiểm tra dữ liệu đầu vào:
 *   - @NotBlank: đảm bảo trường không được null và không rỗng.
 *   - @Size(min = 8): đảm bảo mật khẩu mới có độ dài tối thiểu 8 ký tự.
 *
 * Lớp này không chứa logic xử lý, chỉ đơn thuần đóng vai trò làm cấu trúc dữ liệu trung gian
 * giữa client và service.
 */
package com.clinic.auth.web.dto;

import jakarta.validation.constraints.NotBlank; // Xác thực chuỗi không rỗng
import jakarta.validation.constraints.Size;     // Giới hạn độ dài chuỗi
import lombok.Data;                             // Tự động sinh getter/setter/toString

@Data
public class ChangePasswordRequest {

    /**
     * Mật khẩu hiện tại của người dùng — bắt buộc để xác thực trước khi thay đổi.
     */
    @NotBlank(message = "Current password is required")
    private String currentPassword;

    /**
     * Mật khẩu mới — phải dài tối thiểu 8 ký tự để đảm bảo an toàn.
     */
    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String newPassword;

    /**
     * Trường xác nhận mật khẩu mới — dùng để kiểm tra khớp với newPassword.
     */
    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}
