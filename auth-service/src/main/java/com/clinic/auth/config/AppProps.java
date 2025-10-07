/*
 * Lớp cấu hình AppProps chịu trách nhiệm ánh xạ (bind) các thuộc tính cấu hình của ứng dụng từ
 * file application.yml hoặc từ biến môi trường sang các trường Java tương ứng. Mục đích là gom
 * toàn bộ các giá trị cấu hình quan trọng – như URL frontend, thông tin email, khóa JWT, TTL token
 * và cấu hình CORS – về một nơi duy nhất, dễ truy cập và dễ thay đổi khi triển khai trên các môi
 * trường khác nhau (local, staging, production).
 *
 * Lớp được đánh dấu bằng @Configuration để Spring tự động quét và khởi tạo, còn @Value dùng để
 * đọc giá trị từ property hoặc environment variable (nếu property không tồn tại). Khi ứng dụng khởi
 * động, Spring container sẽ inject các giá trị này vào các trường tương ứng để các thành phần khác
 * có thể dùng trực tiếp thông qua getter.
 */
package com.clinic.auth.config;

import lombok.Getter; // Lombok sinh sẵn các phương thức getter cho tất cả trường
import org.springframework.beans.factory.annotation.Value; // Đọc giá trị từ property hoặc biến môi trường
import org.springframework.context.annotation.Configuration; // Đánh dấu class là cấu hình Spring

@Configuration // Khai báo rằng đây là một lớp cấu hình trong context Spring
@Getter // Lombok tự động sinh getter cho mọi thuộc tính bên dưới
public class AppProps {

    /**
     * -- GETTER --
     *  Trả về URL của frontend, phục vụ cho việc tạo link xác thực, reset mật khẩu hoặc các đường dẫn
     *  giao tiếp ngược từ backend. Getter được Lombok tạo sẵn, định nghĩa thủ công ở đây để dễ override
     *  hoặc kiểm soát thêm trong tương lai.
     */
    // Đọc URL của frontend từ cấu hình hoặc biến môi trường FRONTEND_URL, mặc định localhost:3000
    @Value("${app.frontend-url:${FRONTEND_URL:http://localhost:3000}}")
    private String frontendUrl;

    /**
     * -- GETTER --
     *  Trả về địa chỉ email mặc định dùng khi gửi mail hệ thống. Cho phép các service khác truy cập
     *  mà không cần thao tác trực tiếp với biến môi trường.
     */
    // Địa chỉ email “from” mặc định khi gửi thư, đọc từ app.mail.from hoặc MAIL_FROM
    @Value("${app.mail.from:${MAIL_FROM:no-reply@clinic.com}}")
    private String mailFrom;

    // Khóa bí mật JWT, đọc từ cấu hình hoặc biến JWT_SECRET, mặc định là chuỗi "change-me-please-change-me-please"
    @Value("${app.jwt.secret:${JWT_SECRET:change-me-please-change-me-please}}")
    private String jwtSecret;

    // Tên định danh (issuer) cho token JWT, mặc định là “clinic-booking-app”
    @Value("${app.jwt.issuer:clinic-booking-app}")
    private String issuer;

    // Thời gian sống (TTL) của access token tính bằng phút; hỗ trợ cả tên property cũ và mới
    @Value("${app.jwt.access-token-ttl-minutes:${app.jwt.access-token-expiration-minutes:${JWT_ACCESS_TTL:15}}}")
    private long accessTokenTtlMinutes;

    // Thời gian sống của refresh token tính bằng ngày; hỗ trợ cả tên property cũ và mới
    @Value("${app.jwt.refresh-token-ttl-days:${app.jwt.refresh-token-expiration-days:${JWT_REFRESH_TTL:7}}}")
    private long refreshTokenTtlDays;

    // Danh sách origin được phép truy cập CORS, đọc từ cấu hình hoặc biến môi trường, mặc định localhost:3000
    @Value("${app.cors.allowed-origins:${CORS_ALLOWED_ORIGINS:http://localhost:3000}}")
    private String corsAllowedOrigins;
}
