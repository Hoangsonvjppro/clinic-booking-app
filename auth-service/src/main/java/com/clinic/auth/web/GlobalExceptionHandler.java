/*
 * GlobalExceptionHandler là lớp chịu trách nhiệm xử lý tập trung (centralized exception handling)
 * cho toàn bộ các controller trong ứng dụng.
 * Thay vì để từng controller tự bắt lỗi và phản hồi riêng, lớp này giúp gom logic xử lý lỗi
 * vào một nơi thống nhất, dễ bảo trì và nhất quán về định dạng phản hồi.
 *
 * Mục tiêu:
 *  - Chuẩn hoá cấu trúc phản hồi lỗi cho client (tránh lộn xộn giữa các API).
 *  - Giảm lặp lại code try/catch ở tầng controller.
 *  - Dễ dàng mở rộng khi cần thêm loại lỗi mới.
 *
 * Các loại lỗi được xử lý:
 *  1. MethodArgumentNotValidException — lỗi validation (ví dụ: trường không hợp lệ).
 *  2. IllegalArgumentException        — lỗi tham số hoặc logic nghiệp vụ.
 *  3. ApiException                    — lỗi nghiệp vụ được định nghĩa tùy chỉnh (có HttpStatus riêng).
 *
 * Mỗi handler trả về một ResponseEntity chứa thông tin lỗi ở dạng JSON dễ đọc.
 */
package com.clinic.auth.web;

import org.springframework.http.HttpStatus;                       // Mã trạng thái HTTP
import org.springframework.http.ResponseEntity;                  // Đối tượng phản hồi HTTP
import org.springframework.web.bind.MethodArgumentNotValidException; // Ngoại lệ validation từ @Valid
import org.springframework.web.bind.annotation.ExceptionHandler; // Annotation đánh dấu hàm xử lý lỗi
import org.springframework.web.bind.annotation.RestControllerAdvice; // Áp dụng cho tất cả controller REST

import java.util.HashMap;
import java.util.Map;

import com.clinic.auth.exception.ApiException; // Ngoại lệ tuỳ chỉnh trong hệ thống

@RestControllerAdvice // Áp dụng cho toàn bộ controller REST trong ứng dụng
public class GlobalExceptionHandler {

    /**
     * Xử lý lỗi validation xảy ra khi dữ liệu đầu vào vi phạm các ràng buộc
     * (ví dụ: @NotBlank, @Email, @Size, ...).
     *
     * Trả về JSON chứa danh sách trường và thông báo lỗi tương ứng:
     * {
     *   "email": "Invalid email format",
     *   "password": "Password must not be blank"
     * }
     *
     * @param ex ngoại lệ validation do Spring ném ra
     * @return ResponseEntity với mã 400 (BAD_REQUEST)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> errors.put(e.getField(), e.getDefaultMessage())); // Gom từng lỗi theo field
        return ResponseEntity.badRequest().body(errors); // HTTP 400 + danh sách lỗi
    }

    /**
     * Xử lý IllegalArgumentException — thường dùng cho lỗi tham số không hợp lệ
     * hoặc điều kiện nghiệp vụ bị vi phạm (ví dụ: “Role already exists”).
     *
     * Trả về phản hồi đơn giản:
     * {
     *   "message": "Role already exists: ADMIN"
     * }
     *
     * @param ex ngoại lệ IllegalArgumentException
     * @return ResponseEntity với mã 409 (CONFLICT)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegal(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", ex.getMessage())); // HTTP 409
    }

    /**
     * Xử lý ApiException — loại lỗi tuỳ chỉnh trong hệ thống, có kèm mã lỗi và HttpStatus riêng.
     * Thường được dùng cho các tình huống như: TOKEN_INVALID, USER_NOT_FOUND, DUPLICATE_RESOURCE,...
     *
     * Trả về phản hồi JSON chuẩn:
     * {
     *   "message": "Invalid token",
     *   "errorCode": "INVALID_TOKEN"
     * }
     *
     * @param ex ngoại lệ ApiException do service ném ra
     * @return ResponseEntity với HttpStatus lấy từ đối tượng lỗi
     */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<?> handleApiException(ApiException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getMessage());     // Mô tả lỗi
        body.put("errorCode", ex.getErrorCode()); // Mã lỗi nội bộ
        return ResponseEntity.status(ex.getStatus()).body(body); // HTTP status động theo lỗi
    }
}
