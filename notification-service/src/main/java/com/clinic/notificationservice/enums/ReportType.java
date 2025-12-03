package com.clinic.notificationservice.enums;

/**
 * Types of reports that can be filed.
 * Separated by who can file them (Patient or Doctor).
 */
public enum ReportType {
    // === Patient reports about Doctor ===
    POOR_SERVICE_QUALITY,      // Chất lượng dịch vụ kém
    UNPROFESSIONAL_BEHAVIOR,   // Hành vi thiếu chuyên nghiệp
    WRONG_DIAGNOSIS,           // Chẩn đoán sai
    OVERCHARGING,              // Thu phí quá cao
    NO_SHOW_DOCTOR,            // Bác sĩ không có mặt
    RUDE_BEHAVIOR,             // Thái độ thô lỗ
    
    // === Doctor reports about Patient ===
    NO_SHOW_PATIENT,           // Bệnh nhân không đến (quan trọng nhất)
    LATE_ARRIVAL,              // Đến muộn
    ABUSIVE_BEHAVIOR,          // Hành vi lạm dụng
    FAKE_INFORMATION,          // Thông tin giả mạo
    REPEATED_CANCELLATION,     // Hủy lịch liên tục
    
    // === Common ===
    OTHER                      // Khác
}
