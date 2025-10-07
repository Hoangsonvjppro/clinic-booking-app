/*
 * Ngoại lệ này đại diện cho lỗi “thông tin đăng nhập không hợp lệ” (invalid credentials),
 * thường xảy ra khi người dùng nhập sai tên đăng nhập, mật khẩu hoặc token không còn giá trị.
 * Khi ngoại lệ này được ném ra, hệ thống sẽ phản hồi về client với mã lỗi cố định
 * "INVALID_CREDENTIALS" cùng mã trạng thái HTTP 401 (UNAUTHORIZED).
 *
 * Mục đích của lớp này là giúp tầng xử lý lỗi (GlobalExceptionHandler) dễ dàng nhận diện
 * và phản hồi nhất quán, đồng thời tránh lẫn lộn với các loại lỗi khác như tài nguyên không tồn tại
 * hay lỗi xác thực token.
 *
 * Ví dụ JSON phản hồi:
 * {
 *   "errorCode": "INVALID_CREDENTIALS",
 *   "message": "Tên đăng nhập hoặc mật khẩu không chính xác",
 *   "status": 401
 * }
 */
package com.clinic.auth.exception;

import org.springframework.http.HttpStatus; // Cung cấp mã trạng thái HTTP chuẩn (401 UNAUTHORIZED)

public class InvalidCredentialsException extends ApiException {

    /**
     * Tạo một ngoại lệ biểu thị thông tin đăng nhập sai.
     *
     * @param message Thông điệp mô tả lỗi chi tiết, ví dụ: “Tên đăng nhập hoặc mật khẩu không đúng”
     */
    public InvalidCredentialsException(String message) {
        super(message, "INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED); // Gọi constructor cha với mã lỗi và trạng thái HTTP tương ứng
    }
}
