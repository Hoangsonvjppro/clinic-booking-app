/*
 * Lớp ErrorResponse là Data Transfer Object (DTO) tiêu chuẩn dùng để phản hồi lỗi từ API.
 * Nó giúp chuẩn hoá cấu trúc phản hồi cho mọi lỗi xảy ra trong hệ thống (ngoại lệ, validation, v.v.),
 * giúp client dễ dàng hiển thị và xử lý.
 *
 * Cấu trúc phản hồi ví dụ:
 * {
 *   "timestamp": "2025-10-07T14:20:33",
 *   "message": "Email already in use",
 *   "errorCode": "DUPLICATE_RESOURCE",
 *   "status": 409,
 *   "path": "/api/v1/auth/register",
 *   "validationErrors": [
 *     { "field": "email", "message": "Email already exists" }
 *   ],
 *   "details": {
 *     "method": "POST",
 *     "service": "auth-service"
 *   }
 * }
 *
 * Các trường ý nghĩa:
 *  - timestamp: thời điểm lỗi xảy ra (ISO 8601).
 *  - message: mô tả ngắn gọn lỗi.
 *  - errorCode: mã lỗi chuẩn hoá (ví dụ: INVALID_TOKEN, RESOURCE_NOT_FOUND).
 *  - status: mã HTTP tương ứng.
 *  - path: endpoint mà lỗi phát sinh.
 *  - validationErrors: danh sách lỗi chi tiết trong trường hợp lỗi validation đầu vào.
 *  - details: phần mở rộng (metadata) tuỳ chỉnh cho từng tình huống cụ thể.
 *
 * Annotation @JsonInclude(Include.NON_NULL) giúp loại bỏ các trường null khi trả về JSON,
 * giúp phản hồi ngắn gọn và rõ ràng hơn.
 */
package com.clinic.auth.web.dto;

import com.fasterxml.jackson.annotation.JsonInclude; // Kiểm soát cách serialize JSON
import lombok.Builder; // Cho phép khởi tạo đối tượng bằng Builder pattern
import lombok.Data;    // Lombok sinh getter/setter/toString/hashCode/equals

import java.time.LocalDateTime; // Thời điểm phát sinh lỗi
import java.util.List;          // Danh sách lỗi validation
import java.util.Map;           // Chi tiết bổ sung dưới dạng key-value

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // Bỏ qua các trường null khi serialize JSON
public class ErrorResponse {

    /** Thời điểm phát sinh lỗi, theo định dạng ISO-8601. */
    private LocalDateTime timestamp;

    /** Thông điệp mô tả lỗi. */
    private String message;

    /** Mã lỗi chuẩn hoá nội bộ (ví dụ: INVALID_TOKEN, DUPLICATE_RESOURCE). */
    private String errorCode;

    /** Mã trạng thái HTTP tương ứng (ví dụ: 400, 401, 404, 500). */
    private int status;

    /** Đường dẫn (URI) nơi lỗi xảy ra. */
    private String path;

    /** Danh sách lỗi chi tiết cho từng trường (trong lỗi validation). */
    private List<ValidationError> validationErrors;

    /** Thông tin bổ sung về lỗi, cho phép mở rộng tuỳ chỉnh. */
    private Map<String, Object> details;

    /**
     * Lớp con ValidationError biểu diễn một lỗi cụ thể trong validation đầu vào.
     * Mỗi phần tử chứa tên trường bị lỗi và thông điệp lỗi tương ứng.
     */
    @Data
    @Builder
    public static class ValidationError {
        /** Tên trường dữ liệu bị lỗi (ví dụ: email, password). */
        private String field;

        /** Thông điệp mô tả lý do lỗi (ví dụ: "Email is invalid"). */
        private String message;
    }
}
