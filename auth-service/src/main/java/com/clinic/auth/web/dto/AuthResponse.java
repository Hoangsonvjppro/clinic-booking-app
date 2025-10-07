/*
 * Lớp AuthResponse là một Data Transfer Object (DTO) dùng để đóng gói thông tin phản hồi
 * cho các yêu cầu xác thực (authentication) như đăng nhập hoặc làm mới token.
 *
 * Khi người dùng đăng nhập thành công, hệ thống sẽ trả về đối tượng AuthResponse dưới dạng JSON,
 * bao gồm:
 *   - accessToken: chuỗi JWT dùng để truy cập các API bảo vệ (thời gian sống ngắn).
 *   - refreshToken: chuỗi token dùng để yêu cầu cấp lại accessToken mới khi token cũ hết hạn.
 *   - tokenType: loại token, thường là "Bearer", để client biết cách sử dụng trong header.
 *
 * Ví dụ phản hồi JSON:
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "refreshToken": "f19a6b0a-3c8a-4a4a-bc61-f1c4a6c91be9",
 *   "tokenType": "Bearer"
 * }
 *
 * DTO này được đánh dấu với @Builder để tạo thuận tiện bằng cú pháp chuỗi phương thức:
 *   AuthResponse.builder()
 *       .accessToken(token)
 *       .refreshToken(refresh)
 *       .tokenType("Bearer")
 *       .build();
 *
 * Ngoài ra, @Data từ Lombok tự động sinh getter, setter, equals, hashCode và toString.
 */
package com.clinic.auth.web.dto;

import lombok.Builder; // Cho phép khởi tạo đối tượng bằng Builder pattern
import lombok.Data;    // Sinh tự động getter/setter/toString/equals/hashCode

@Data
@Builder
public class AuthResponse {

    /**
     * JWT dùng để xác thực người dùng khi truy cập API (thường có thời hạn ngắn).
     */
    private String accessToken;

    /**
     * Token làm mới (refresh token) dùng để lấy accessToken mới khi accessToken hết hạn.
     */
    private String refreshToken;

    /**
     * Kiểu token, mặc định là "Bearer" — client sẽ gửi kèm vào header:
     * Authorization: Bearer <accessToken>
     */
    private String tokenType;
}
