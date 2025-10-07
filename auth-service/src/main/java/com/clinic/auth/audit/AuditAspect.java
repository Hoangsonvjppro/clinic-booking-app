/**
 * Lớp AuditAspect chịu trách nhiệm ghi nhận và lưu trữ nhật ký hành động (audit log) trong hệ thống xác thực.
 * Khi một phương thức được đánh dấu bằng @Audited được gọi, lớp này sẽ tự động chặn luồng thực thi, thu thập
 * các thông tin liên quan như tên phương thức, danh sách tham số, hành động nghiệp vụ (action) và loại thực thể
 * (entityType). Sau đó, nó cho phép phương thức gốc tiếp tục chạy và ghi lại kết quả (thành công hoặc lỗi) thông
 * qua AuditService. Cách tiếp cận này giúp tách biệt rõ ràng giữa logic nghiệp vụ và logic ghi nhật ký, bảo đảm
 * mọi hoạt động quan trọng đều được ghi lại nhất quán và có thể kiểm tra truy vết sau này.

 * Lớp này là một Aspect trong Spring AOP và không kế thừa hoặc triển khai interface đặc biệt nào. Nó hoạt động
 * như một thành phần cross-cutting, được Spring quản lý vòng đời giống như các bean thông thường.
 */
package com.clinic.auth.audit;

import com.clinic.auth.service.AuditService; // Dịch vụ chịu trách nhiệm ghi sự kiện audit vào cơ sở dữ liệu hoặc log file
import lombok.RequiredArgsConstructor; // Lombok tự động sinh constructor cho các trường final (hỗ trợ Dependency Injection)
import org.aspectj.lang.ProceedingJoinPoint; // Đại diện cho lời gọi phương thức thực tế (join point), cho phép ta tiếp tục hoặc dừng thực thi
import org.aspectj.lang.annotation.Around; // Chỉ định advice dạng “bao quanh” (before + after)
import org.aspectj.lang.annotation.Aspect; // Đánh dấu lớp này là một Aspect trong Spring
import org.aspectj.lang.reflect.MethodSignature; // Cung cấp khả năng lấy thông tin về tên, tham số, và kiểu trả về của phương thức
import org.springframework.stereotype.Component; // Biến lớp này thành một Spring bean để IoC container quản lý

import java.lang.reflect.Method; // Reflection API: cho phép truy xuất metadata của phương thức (ví dụ @Audited)
import java.util.Arrays; // Tiện ích để in danh sách tham số (args) dưới dạng chuỗi

@Aspect // Xác định lớp này là một Aspect để Spring AOP nhận diện và weave vào các join point phù hợp
@Component // Đăng ký bean này trong Spring context, cho phép sử dụng dependency injection
@RequiredArgsConstructor // Lombok sinh constructor có tham số cho trường final AuditService
public class AuditAspect {

    private final AuditService auditService; // Thể hiện của AuditService, dùng để ghi các sự kiện audit

    /**
     * Advice này được áp dụng cho mọi phương thức có chú thích @Audited. Khi phương thức đó được gọi,
     * hệ thống sẽ tạo bản ghi chứa tên hàm, tham số, hành động (action) và loại thực thể (entityType).
     * Sau khi phương thức gốc thực thi xong, hệ thống ghi log thành công hoặc nếu có lỗi sẽ ghi kèm chi tiết lỗi.
     * Cơ chế này giúp tách riêng phần ghi log khỏi logic nghiệp vụ, tránh lặp mã và đảm bảo tính nhất quán.

     * Pseudocode:
     * <pre>
     *   lấy Method từ joinPoint
     *   đọc annotation @Audited để biết action và entityType
     *   tạo chuỗi details mô tả lời gọi
     *   try:
     *       result = joinPoint.proceed()
     *       auditService.logEvent(action, entityType, null, details)
     *       return result
     *   catch (Throwable t):
     *       auditService.logEvent(action, entityType, null, details, t.getMessage())
     *       throw t
     * </pre>
     *
     * @param joinPoint lời gọi phương thức đang được Aspect bao quanh
     * @return kết quả thực thi thực tế của phương thức gốc
     * @throws Throwable giữ nguyên hành vi ném lỗi của phương thức ban đầu
     */
    @Around("@annotation(com.clinic.auth.audit.Audited)") // Advice được áp dụng cho mọi method có chú thích @Audited
    public Object auditMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature(); // Lấy chữ ký phương thức (tên, kiểu trả về, tham số)
        Method method = signature.getMethod(); // Truy xuất đối tượng Method để đọc annotation
        Audited auditedAnnotation = method.getAnnotation(Audited.class); // Lấy instance của annotation @Audited

        String action = auditedAnnotation.action(); // Lấy giá trị "action" được định nghĩa trong annotation
        String entityType = auditedAnnotation.entityType(); // Lấy giá trị "entityType" mô tả loại thực thể được thao tác
        String details = String.format( // Tạo chuỗi mô tả lời gọi để ghi log chi tiết
                "Method: %s, Args: %s",
                method.getName(), // Lấy tên của phương thức đang được gọi
                Arrays.toString(joinPoint.getArgs()) // Liệt kê danh sách tham số truyền vào phương thức
        );

        try {
            Object result = joinPoint.proceed(); // Thực thi phương thức gốc và nhận kết quả
            auditService.logEvent(action, entityType, null, details); // Ghi sự kiện audit cho trường hợp thành công
            return result; // Trả lại kết quả cho caller (giống như không có aspect can thiệp)
        } catch (Throwable t) {
            auditService.logEvent(action, entityType, null, details, t.getMessage()); // Ghi log audit kèm thông tin lỗi nếu xảy ra exception
            throw t; // Ném lại ngoại lệ để giữ nguyên luồng xử lý của ứng dụng
        }
    }
}
