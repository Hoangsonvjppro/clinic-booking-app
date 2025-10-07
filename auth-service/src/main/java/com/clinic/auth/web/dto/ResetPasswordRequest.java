/*
 * Lớp ResetPasswordRequest là Data Transfer Object (DTO) được sử dụng khi người dùng
 * thực hiện bước cuối cùng của quá trình “Quên mật khẩu” — đặt lại mật khẩu mới.
 *
 * Sau khi người dùng nhấp vào đường dẫn được gửi qua email (chứa token),
 * frontend sẽ gửi yêu cầu POST đến API reset password, với dữ liệu JSON có dạng:
 * {
 *   "token": "a8d0b2e5-91a7-4f63-b33c-8b12de3e9981",
 *   "newPassword": "MyNewPass456@",
 *   "confirmPassword": "MyNewPass456@"
 * }
 *
 * Các annotation validation đảm bảo dữ liệu hợp lệ trước khi đến tầng service:
 *  - @NotBlank: tất cả các trường đều bắt buộc.
 *  - @Size(min = 8): yêu cầu mật khẩu mới có độ dài tối thiểu 8 ký tự.
 *
 * Mục tiêu của lớp này là tách biệt dữ liệu đầu vào của API reset mật khẩu
 * khỏi tầng nghiệp vụ, đồng thời đảm bảo an toàn và tính toàn vẹn dữ liệu.
 */
package com.clinic.auth.web.dto;

import jakarta.validation.constraints.NotBlank; // Không cho phép để trống
import jakarta.validation.constraints.Size;     // Giới hạn độ dài chuỗi
import lombok.Data;                             // Lombok sinh getter/setter/toString tự động

@Data
public class ResetPasswordRequest {

    /**
     * Token xác thực quá trình đặt lại mật khẩu (được gửi qua email). 
     * Phải hợp lệ và còn hạn sử dụng.
     */
    @NotBlank(message = "Token is required")
    private String token;

    /**
     * Mật khẩu mới do người dùng nhập. 
     * Yêu cầu tối thiểu 8 ký tự để đảm bảo độ mạnh.
     */
    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String newPassword;

    /**
     * Trường xác nhận lại mật khẩu mới, giúp tránh lỗi gõ sai.
     */
    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}
