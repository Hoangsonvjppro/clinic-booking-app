/*
 * Lớp UserRolesResponse là Data Transfer Object (DTO) được sử dụng để trả về thông tin
 * vai trò (roles) của một người dùng cho phía client.
 * Nó thường được trả về trong các API quản trị hoặc API tra cứu vai trò của người dùng.
 *
 * Cấu trúc ví dụ của phản hồi JSON:
 * {
 *   "email": "doctor@example.com",
 *   "roles": ["DOCTOR", "ADMIN"],
 *   "enabled": true
 * }
 *
 * Ý nghĩa các trường:
 *  - email: địa chỉ email của người dùng.
 *  - roles: tập hợp tên vai trò mà người dùng đang có.
 *  - enabled: trạng thái kích hoạt tài khoản (true nếu người dùng đang hoạt động).
 *
 * Lớp này chỉ chứa dữ liệu phản hồi, không có logic xử lý.
 * Lombok @Data giúp tự động sinh getter/setter/toString/hashCode/equals.
 */
package com.clinic.auth.web.dto;

import lombok.Data; // Lombok sinh getter/setter/toString/hashCode/equals
import java.util.Set; // Dùng Set để đảm bảo các vai trò không trùng lặp

@Data
public class UserRolesResponse {

    /**
     * Địa chỉ email của người dùng được truy vấn.
     */
    private String email;

    /**
     * Tập hợp tên các vai trò mà người dùng hiện có (ví dụ: ADMIN, DOCTOR).
     */
    private Set<String> roles;

    /**
     * Trạng thái kích hoạt của tài khoản — true nếu người dùng được phép đăng nhập.
     */
    private boolean enabled;
}
