/*
 * Lớp AuthServiceApplication là điểm khởi động (entry point) chính của microservice “auth-service”.
 * Đây là nơi Spring Boot bắt đầu khởi chạy ứng dụng, quét toàn bộ các component, cấu hình,
 * và khởi tạo ngữ cảnh (ApplicationContext).
 *
 * Annotation chi tiết:
 *  - @SpringBootApplication:
 *      + Kết hợp ba annotation: @Configuration, @EnableAutoConfiguration, @ComponentScan.
 *      + Giúp Spring Boot tự động quét các package con (ví dụ: com.clinic.auth.service, web, repo, model…)
 *        và đăng ký bean vào container.
 *  - @EnableAsync:
 *      + Cho phép sử dụng các phương thức được đánh dấu @Async (chạy bất đồng bộ trên thread riêng),
 *        ví dụ trong EmailService hoặc AuditService.
 *
 * Khi chạy, SpringApplication sẽ khởi động embedded server (mặc định là Tomcat),
 * load cấu hình từ application.yml/application.properties và mở endpoint API của auth-service.
 *
 * Lệnh chạy từ terminal:
 *   mvn spring-boot:run
 * Hoặc chạy trực tiếp class này trong IDE.
 */
package com.clinic.auth;

import org.springframework.boot.SpringApplication;              // Lớp tiện ích để khởi chạy Spring Boot app
import org.springframework.boot.autoconfigure.SpringBootApplication; // Cấu hình tự động và quét component
import org.springframework.scheduling.annotation.EnableAsync;  // Kích hoạt hỗ trợ chạy bất đồng bộ

@SpringBootApplication // Kích hoạt auto-configuration, component scan và bean definition
@EnableAsync            // Cho phép các phương thức @Async chạy trên thread pool riêng
public class AuthServiceApplication {

    /**
     * Phương thức main — điểm bắt đầu của ứng dụng auth-service.
     * Khi thực thi, Spring Boot sẽ khởi chạy server nội bộ và nạp toàn bộ ngữ cảnh ứng dụng.
     *
     * @param args đối số dòng lệnh (nếu có)
     */
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args); // Khởi động Spring Boot Application
    }
}
