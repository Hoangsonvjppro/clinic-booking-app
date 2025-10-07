/*
 * Lớp LoginRequest là Data Transfer Object (DTO) dùng để nhận thông tin đăng nhập từ client.
 * Khi người dùng gửi yêu cầu đăng nhập, dữ liệu JSON sẽ được ánh xạ vào đối tượng này.
 *
 * Cấu trúc ví dụ của request:
 * {
 *   "email": "user@example.com",
 *   "password": "MySecurePass123!"
 * }
 *
 * Các annotation xác thực (validation):
 *  - @Email: đảm bảo trường email có định dạng hợp lệ.
 *  - @NotBlank: đảm bảo email và password không được để trống hoặc chỉ chứa khoảng trắng.
 *
 * Lớp này được dùng trực tiếp ở tầng controller, trước khi truyền dữ liệu xuống service
 * để thực hiện xác thực tài khoản.
 * Lombok @Data giúp tự động sinh getter/setter, equals, hashCode, và toString,
 * giảm thiểu boilerplate code.
 */
package com.clinic.auth.web.dto;

import jakarta.validation.constraints.Email;    // Kiểm tra định dạng email
import jakarta.validation.constraints.NotBlank; // Không cho phép null hoặc chuỗi rỗng
import lombok.Data;                             // Tự động sinh getter/setter/toString/hashCode

@Data
public class LoginRequest {

    /**
     * Địa chỉ email của người dùng — được sử dụng làm tên đăng nhập.
     */
    @Email
    @NotBlank
    private String email;

    /**
     * Mật khẩu người dùng — bắt buộc, không được để trống.
     */
    @NotBlank
    private String password;
}
