/*
 * Lớp RegisterRequest là Data Transfer Object (DTO) dùng để nhận dữ liệu từ client
 * khi người dùng đăng ký tài khoản mới.
 * Nó đóng vai trò trung gian giữa request JSON từ frontend và tầng service xử lý logic đăng ký.
 *
 * Cấu trúc ví dụ của request:
 * {
 *   "email": "newuser@example.com",
 *   "password": "SecurePass123!",
 *   "defaultRole": "PATIENT"
 * }
 *
 * Các annotation xác thực (validation):
 *  - @Email: kiểm tra định dạng email hợp lệ.
 *  - @NotBlank: bắt buộc email và password không được rỗng hoặc chỉ chứa khoảng trắng.
 *  - defaultRole: không bắt buộc, nếu không gửi thì hệ thống tự gán mặc định là “PATIENT”.
 *
 * Lớp này giúp đảm bảo dữ liệu đầu vào hợp lệ, tách biệt giữa tầng web và tầng nghiệp vụ.
 */
package com.clinic.auth.web.dto;

import jakarta.validation.constraints.Email;    // Kiểm tra định dạng email
import jakarta.validation.constraints.NotBlank; // Không được để trống
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;                             // Lombok sinh getter/setter/toString/hashCode/equals

@Data
public class RegisterRequest {

    /**
     * Địa chỉ email dùng làm tài khoản đăng nhập — bắt buộc, phải đúng định dạng.
     */
    @NotBlank(message = "Email cannot be empty")
    @Email(
            regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
            message = "Địa chỉ email không hợp lệ (phải có dạng name@domain.com)"
    )
    private String email;

    /**
     * Mật khẩu tài khoản — bắt buộc, được mã hoá trước khi lưu vào cơ sở dữ liệu.
     */
    @NotBlank(message = "Passwod cannot be empty")
    @Size(min = 8, max = 64, message = "Mật khẩu phải từ 8 đến 64 ký tự")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
            message = "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 chữ số"
    )
    private String password;

    /**
     * Vai trò mặc định khi đăng ký (tùy chọn).
     * Nếu không gửi, hệ thống sẽ tự động gán là "PATIENT".
     * Có thể là: ADMIN, DOCTOR, PATIENT, ...
     */
    private String defaultRole;
}
