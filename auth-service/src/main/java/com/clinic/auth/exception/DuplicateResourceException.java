/*
 * Ngoại lệ này biểu diễn tình huống “trùng lặp tài nguyên” (duplicate resource) — ví dụ: khi hệ thống
 * cố gắng tạo mới một thực thể nhưng giá trị định danh (như email, username, mã bác sĩ, v.v.) đã tồn tại
 * trong cơ sở dữ liệu. Việc tách riêng loại lỗi này giúp tầng xử lý có thể phản hồi thống nhất cho client
 * với mã trạng thái HTTP 409 (CONFLICT) và mã lỗi rõ ràng là "DUPLICATE_RESOURCE".
 *
 * Lớp kế thừa từ ApiException, nên tự động kế thừa toàn bộ cơ chế xử lý chung: mang theo message,
 * errorCode, và HttpStatus. Khi ném ngoại lệ này, controller advice hoặc global exception handler
 * sẽ chuyển thành JSON có cấu trúc dạng:
 *
 * {
 *   "errorCode": "DUPLICATE_RESOURCE",
 *   "message": "Email đã được sử dụng",
 *   "status": 409
 * }
 */
package com.clinic.auth.exception;

import org.springframework.http.HttpStatus; // Cung cấp hằng số HttpStatus.CONFLICT tương ứng 409

public class DuplicateResourceException extends ApiException {

    /**
     * Khởi tạo ngoại lệ “Duplicate Resource” với thông điệp cụ thể.
     *
     * @param message Thông điệp mô tả lỗi chi tiết (ví dụ: “Tài khoản với email này đã tồn tại”)
     */
    public DuplicateResourceException(String message) {
        super(message, "DUPLICATE_RESOURCE", HttpStatus.CONFLICT); // Gọi constructor cha với mã lỗi cố định và HTTP 409
    }
}
