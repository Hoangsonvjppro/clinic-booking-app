/*
 * Lớp ngoại lệ (exception) này được sử dụng làm chuẩn chung cho các lỗi xảy ra trong auth-service.
 * Mỗi khi một luồng xử lý gặp lỗi nghiệp vụ hoặc kỹ thuật, service có thể ném ra ApiException thay
 * vì RuntimeException thông thường. Ưu điểm của cách này là phản hồi HTTP trả về cho client sẽ chứa
 * đầy đủ thông tin có cấu trúc — gồm mã lỗi (errorCode), thông điệp (message) và mã trạng thái (HttpStatus).
 *
 * Ví dụ: khi người dùng đăng nhập sai mật khẩu, service có thể ném ApiException với errorCode="AUTH_INVALID_CREDENTIALS"
 * và status=HttpStatus.UNAUTHORIZED. Tầng controller hoặc handler toàn cục sẽ dựa vào dữ liệu này để sinh
 * JSON phản hồi nhất quán, giúp phía frontend dễ hiển thị và debug.
 */
package com.clinic.auth.exception;

import lombok.Getter; // Tự động sinh getter cho các trường bên dưới
import org.springframework.http.HttpStatus; // Đại diện cho mã trạng thái HTTP chuẩn (200, 400, 401, 500,...)

@Getter // Tự sinh getter cho status, message, errorCode
public class ApiException extends RuntimeException {

    private final HttpStatus status; // Mã trạng thái HTTP phản ánh loại lỗi (BAD_REQUEST, UNAUTHORIZED,...)
    private final String message; // Thông điệp lỗi mô tả ngắn gọn nguyên nhân
    private final String errorCode; // Mã lỗi nội bộ giúp frontend/backend phân biệt từng loại lỗi nghiệp vụ

    /**
     * Khởi tạo một đối tượng ApiException mới với thông tin chi tiết về lỗi.
     *
     * @param message   Chuỗi mô tả lỗi ngắn gọn, sẽ được phản hồi về client
     * @param errorCode Mã lỗi nghiệp vụ hoặc kỹ thuật (ví dụ: USER_NOT_FOUND, TOKEN_EXPIRED)
     * @param status    Mã trạng thái HTTP tương ứng với lỗi (ví dụ: 400, 401, 404, 500)
     */
    public ApiException(String message, String errorCode, HttpStatus status) {
        super(message); // Gọi constructor của RuntimeException để lưu message vào stack trace
        this.message = message; // Gán thông điệp lỗi cụ thể cho field nội bộ
        this.errorCode = errorCode; // Gán mã lỗi nghiệp vụ
        this.status = status; // Gán mã trạng thái HTTP cho phản hồi
    }
}
