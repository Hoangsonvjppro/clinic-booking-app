/*
 * Ngoại lệ này được sử dụng khi hệ thống phát hiện token xác thực (JWT) không hợp lệ —
 * có thể là token đã hết hạn, bị giả mạo, sai định dạng hoặc không khớp với thông tin người dùng.
 * Khi gặp tình huống này, service sẽ ném InvalidTokenException để báo cho tầng xử lý lỗi
 * chuyển đổi phản hồi thành HTTP 401 (UNAUTHORIZED), kèm mã lỗi chuẩn "INVALID_TOKEN".
 *
 * Mục tiêu là cung cấp phản hồi có cấu trúc, rõ ràng để phía client (frontend hoặc mobile app)
 * biết rằng người dùng cần thực hiện đăng nhập lại hoặc refresh token trước khi tiếp tục.
 *
 * Ví dụ phản hồi JSON:
 * {
 *   "errorCode": "INVALID_TOKEN",
 *   "message": "Mã token không hợp lệ hoặc đã hết hạn",
 *   "status": 401
 * }
 */
package com.clinic.auth.exception;

import org.springframework.http.HttpStatus; // Sử dụng hằng số HttpStatus.UNAUTHORIZED (401)

public class InvalidTokenException extends ApiException {

    /**
     * Khởi tạo ngoại lệ "Invalid Token" với thông điệp mô tả chi tiết.
     *
     * @param message Thông điệp lỗi, ví dụ: "Token không hợp lệ" hoặc "Token đã hết hạn"
     */
    public InvalidTokenException(String message) {
        super(message, "INVALID_TOKEN", HttpStatus.UNAUTHORIZED); // Gọi constructor cha với mã lỗi và mã HTTP tương ứng
    }
}
