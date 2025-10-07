/*
 * Ngoại lệ này được sử dụng khi hệ thống không tìm thấy tài nguyên được yêu cầu — ví dụ:
 * người dùng cố gắng truy cập tới một user ID, role, hoặc token không tồn tại trong cơ sở dữ liệu.
 * Khi ném ngoại lệ này, tầng xử lý lỗi toàn cục sẽ trả về phản hồi HTTP 404 (NOT_FOUND)
 * cùng mã lỗi chuẩn "RESOURCE_NOT_FOUND".
 *
 * Việc định nghĩa riêng lớp ResourceNotFoundException giúp mã nguồn rõ ràng hơn,
 * dễ dàng phân biệt lỗi “không tìm thấy” với các loại lỗi khác (như lỗi xác thực, lỗi trùng dữ liệu, v.v.),
 * đồng thời đảm bảo phản hồi đến client có cấu trúc nhất quán, dễ debug và dễ hiển thị thông báo người dùng.
 *
 * Ví dụ JSON phản hồi:
 * {
 *   "errorCode": "RESOURCE_NOT_FOUND",
 *   "message": "Không tìm thấy người dùng có ID = 123",
 *   "status": 404
 * }
 */
package com.clinic.auth.exception;

import org.springframework.http.HttpStatus; // Sử dụng hằng số HttpStatus.NOT_FOUND (404)

public class ResourceNotFoundException extends ApiException {

    /**
     * Khởi tạo ngoại lệ "Resource Not Found" với thông điệp chi tiết.
     *
     * @param message Thông điệp mô tả lỗi, ví dụ: “Không tìm thấy tài khoản người dùng”
     */
    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND", HttpStatus.NOT_FOUND); // Gọi constructor cha với mã lỗi và mã HTTP tương ứng
    }
}
