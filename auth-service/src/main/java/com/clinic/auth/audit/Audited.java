package com.clinic.auth.audit;
/*
  Annotation này dùng để đánh dấu những phương thức cần được ghi nhật ký (audit). Khi một method gắn @Audited
  được gọi, AuditAspect sẽ tự động chặn, đọc các thông tin “action” và “entityType” từ annotation này, gom thêm
  chi tiết lời gọi (tên phương thức, tham số) rồi ủy quyền cho AuditService ghi log. Cách tiếp cận này tách bạch
  phần khai báo ý định (annotate ở chỗ viết nghiệp vụ) và phần hiện thực (Aspect xử lý tập trung), giúp mã nguồn
  gọn gàng, dễ kiểm soát và thay đổi chuẩn ghi log ở một nơi duy nhất.
 */

import java.lang.annotation.ElementType; // Liệt kê các “đích” có thể gắn annotation (class, method, field, …)
import java.lang.annotation.Retention; // Chỉ định mức độ “giữ lại” của annotation (SOURCE/CLASS/RUNTIME)
import java.lang.annotation.RetentionPolicy; // Các hằng định nghĩa chính sách giữ lại của annotation
import java.lang.annotation.Target; // Áp dụng annotation này cho loại phần tử ngôn ngữ nào

@Target(ElementType.METHOD) // Annotation chỉ được gắn lên METHOD (không cho class/field/param)
@Retention(RetentionPolicy.RUNTIME) // Annotation tồn tại đến lúc chạy để Aspect/Reflection có thể đọc được
public @interface Audited { // Khai báo một annotation kiểu “marker + metadata” dành cho audit

    String action(); // Bắt buộc khai báo “hành động” nghiệp vụ, ví dụ: REGISTER_USER, UPDATE_PROFILE, LOGIN

    String entityType(); // Bắt buộc khai báo “loại thực thể” bị tác động, ví dụ: USER, ROLE, PERMISSION
}
