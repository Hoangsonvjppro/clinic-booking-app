/*
 * Lớp TokenRefreshRequest là Data Transfer Object (DTO) được sử dụng để nhận yêu cầu
 * làm mới access token từ phía client.
 * Khi access token hết hạn, client sẽ gửi refresh token hiện có lên server để yêu cầu
 * cấp lại cặp token mới (access + refresh).
 *
 * Cấu trúc JSON ví dụ:
 * {
 *   "refreshToken": "c8a3f09e-42be-4f12-9f21-3a1c4b7e7a90"
 * }
 *
 * Ràng buộc dữ liệu:
 *  - @NotBlank: refreshToken bắt buộc phải có và không được rỗng.
 *
 * Lớp này giúp đảm bảo yêu cầu làm mới token được xác định rõ ràng,
 * đồng thời giúp tách biệt dữ liệu request khỏi tầng nghiệp vụ trong AuthService.
 */
package com.clinic.auth.web.dto;

import jakarta.validation.constraints.NotBlank; // Đảm bảo trường không được rỗng/null
import lombok.Data;                             // Sinh tự động getter/setter/toString/hashCode

@Data
public class TokenRefreshRequest {

    /**
     * Refresh token hợp lệ do hệ thống cấp trước đó.
     * Dùng để yêu cầu cấp lại access token mới khi token cũ hết hạn.
     */
    @NotBlank
    private String refreshToken;
}
