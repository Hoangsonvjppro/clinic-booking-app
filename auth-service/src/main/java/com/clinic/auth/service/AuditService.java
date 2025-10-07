/*
 * Dịch vụ AuditService chịu trách nhiệm ghi lại các sự kiện (audit logs) phát sinh trong hệ thống.
 * Bất kỳ hành động quan trọng nào (ví dụ: đăng nhập, đăng ký, thay đổi dữ liệu, thao tác nhạy cảm)
 * đều có thể gọi đến lớp này để lưu thông tin phục vụ việc theo dõi, kiểm tra, hoặc phân tích bảo mật.
 *
 * Khi được gọi, AuditService sẽ:
 *  1. Lấy thông tin người dùng hiện tại (Authentication) từ SecurityContext.
 *  2. Lấy thông tin HTTP request (địa chỉ IP, User-Agent).
 *  3. Xây dựng đối tượng AuditLog (sử dụng builder) chứa toàn bộ chi tiết hành động.
 *  4. Lưu bản ghi này vào cơ sở dữ liệu thông qua AuditLogRepository.
 *
 * Các phương thức logEvent được đánh dấu @Async, nghĩa là hoạt động ghi log sẽ chạy không đồng bộ
 * (ở luồng riêng), giúp không làm chậm phản hồi của các request chính.
 *
 * Nếu việc lưu log vào DB thất bại (ví dụ: lỗi kết nối DB), hệ thống sẽ ghi cảnh báo ra stderr để tránh mất dấu vết.
 */
package com.clinic.auth.service;

import com.clinic.auth.model.AuditLog; // Thực thể ánh xạ bảng audit_logs
import com.clinic.auth.repository.AuditLogRepository; // Repository thao tác với audit_logs
import jakarta.servlet.http.HttpServletRequest; // Để lấy thông tin IP, User-Agent
import lombok.RequiredArgsConstructor; // Tự sinh constructor cho trường final
import org.springframework.scheduling.annotation.Async; // Cho phép chạy phương thức bất đồng bộ
import org.springframework.security.core.Authentication; // Đại diện thông tin người dùng xác thực
import org.springframework.security.core.context.SecurityContextHolder; // Lấy Authentication hiện tại
import org.springframework.stereotype.Service; // Đánh dấu đây là service trong Spring
import org.springframework.web.context.request.RequestContextHolder; // Truy cập request hiện tại
import org.springframework.web.context.request.ServletRequestAttributes; // Lấy HttpServletRequest từ context

import java.util.Optional; // Dự phòng cho các thao tác trả về giá trị tùy chọn

@Service // Đăng ký bean dịch vụ cho Spring
@RequiredArgsConstructor // Lombok tạo constructor tự động cho các trường final
public class AuditService {

    private final AuditLogRepository auditLogRepository; // Repository để lưu bản ghi audit vào DB

    /**
     * Ghi sự kiện audit khi hành động thành công, không có lỗi.
     * Phương thức này chỉ đơn giản gọi bản mở rộng có thêm errorMessage=null.
     *
     * @param action     Hành động nghiệp vụ được thực hiện (ví dụ: LOGIN, REGISTER, UPDATE_PROFILE)
     * @param entityType Loại thực thể liên quan (ví dụ: USER, ROLE)
     * @param entityId   ID của thực thể bị tác động (có thể null nếu không liên quan đến đối tượng cụ thể)
     * @param details    Chuỗi mô tả chi tiết về hành động
     */
    @Async // Chạy bất đồng bộ để không chặn luồng chính
    public void logEvent(String action, String entityType, String entityId, String details) {
        logEvent(action, entityType, entityId, details, null); // Gọi phương thức chính với errorMessage=null
    }

    /**
     * Ghi một sự kiện audit (thành công hoặc thất bại) kèm đầy đủ thông tin ngữ cảnh.
     * Hệ thống sẽ tự động lấy thông tin người dùng hiện tại, IP, User-Agent và trạng thái hành động.
     *
     * @param action       Hành động nghiệp vụ (ví dụ: DELETE_USER)
     * @param entityType   Loại thực thể (ví dụ: USER)
     * @param entityId     ID của thực thể bị tác động (ví dụ: 123)
     * @param details      Mô tả chi tiết về hành động được thực hiện
     * @param errorMessage Thông điệp lỗi (nếu có), null nếu hành động thành công
     */
    @Async
    public void logEvent(String action, String entityType, String entityId, String details, String errorMessage) {
        try {
            // Lấy người dùng hiện tại từ SecurityContext
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            // Lấy request hiện tại (nếu tồn tại)
            HttpServletRequest request = getCurrentRequest();

            // Email người thực hiện (nếu chưa xác thực -> anonymous)
            String userEmail = auth != null ? auth.getName() : "anonymous";

            // Lấy địa chỉ IP từ header X-Forwarded-For hoặc remoteAddr
            String ipAddress = request != null ? getClientIp(request) : null;

            // Lấy thông tin trình duyệt/thiết bị từ header User-Agent
            String userAgent = request != null ? request.getHeader("User-Agent") : null;

            // Xây dựng đối tượng AuditLog
            AuditLog log = AuditLog.builder()
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .userEmail(userEmail)
                    .details(details)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .status(errorMessage != null ? "FAILED" : "SUCCESS") // Ghi trạng thái tùy thuộc có lỗi hay không
                    .errorMessage(errorMessage)
                    .build();

            // Lưu bản ghi vào cơ sở dữ liệu
            auditLogRepository.save(log);
        } catch (Exception e) {
            // Nếu lỗi khi ghi DB, fallback ghi ra stderr để không mất dấu log
            System.err.println("Failed to save audit log: " + e.getMessage());
        }
    }

    /**
     * Lấy đối tượng HttpServletRequest hiện tại từ RequestContextHolder.
     * Trả về null nếu phương thức không nằm trong ngữ cảnh HTTP (ví dụ: chạy background).
     *
     * @return HttpServletRequest hoặc null nếu không tồn tại
     */
    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes != null ? attributes.getRequest() : null;
    }

    /**
     * Trích xuất địa chỉ IP của client từ request. Nếu request đi qua proxy hoặc load balancer,
     * hệ thống sẽ ưu tiên đọc từ header "X-Forwarded-For" (thông thường chứa IP thực).
     *
     * @param request đối tượng HttpServletRequest hiện tại
     * @return Địa chỉ IP của client
     */
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For"); // Header chứa IP thực (nếu có)
        if (xfHeader != null) {
            return xfHeader.split(",")[0]; // Trường hợp có nhiều IP, lấy IP đầu tiên
        }
        return request.getRemoteAddr(); // Nếu không có header, lấy IP trực tiếp từ request
    }
}
