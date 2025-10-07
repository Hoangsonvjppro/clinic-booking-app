/*
 * Lớp ForgotPasswordRequest là Data Transfer Object (DTO) dùng để nhận yêu cầu
 * “Quên mật khẩu” từ phía client.
 * Khi người dùng nhập email để yêu cầu đặt lại mật khẩu, dữ liệu sẽ được gửi lên API
 * dưới dạng JSON và ánh xạ vào lớp này.
 *
 * Cấu trúc ví dụ của request:
 * {
 *   "email": "user@example.com"
 * }
 *
 * Annotation kiểm tra hợp lệ (validation):
 *  - @NotBlank: Đảm bảo email không được để trống hoặc chỉ chứa khoảng trắng.
 *  - @Email: Kiểm tra định dạng email hợp lệ.
 *
 * Mục tiêu của lớp này là tách biệt dữ liệu đầu vào khỏi tầng logic nghiệp vụ,
 * giúp validation và mapping dữ liệu trở nên rõ ràng, chuẩn RESTful.
 */
package com.clinic.auth.web.dto;

import jakarta.validation.constraints.Email;    // Kiểm tra định dạng email
import jakarta.validation.constraints.NotBlank; // Kiểm tra không được để trống
import lombok.Data;                             // Tự sinh getter/setter/toString/hashCode/equals

@Data
public class ForgotPasswordRequest {

    /**
     * Địa chỉ email của người dùng yêu cầu đặt lại mật khẩu.
     * Phải hợp lệ và không được để trống.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
}
