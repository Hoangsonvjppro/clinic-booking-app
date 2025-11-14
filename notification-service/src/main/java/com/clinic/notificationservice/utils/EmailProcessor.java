package com.clinic.notificationservice.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
public class EmailProcessor {

    @Autowired
    private SpringTemplateEngine templateEngine;

    public String renderAppointmentEmail(Map<String, Object> body) {
        Context context = new Context();
        context.setVariables(body);

        String status = body.get("status").toString();

        // thêm màu và tiêu đề theo trạng thái
        switch (status) {
            case "Chờ xác nhận" -> {
                context.setVariable("headerColor", "#f59e0b");
                context.setVariable("statusColor", "#f59e0b");
                context.setVariable("title", "Lịch hẹn đang chờ xác nhận");
            }
            case "Đã xác nhận" -> {
                context.setVariable("headerColor", "#10b981");
                context.setVariable("statusColor", "#10b981");
                context.setVariable("title", "Lịch hẹn đã được xác nhận");
            }
            case "Đã hoàn tất" -> {
                context.setVariable("headerColor", "#3b82f6");
                context.setVariable("statusColor", "#3b82f6");
                context.setVariable("title", "Lịch hẹn đã hoàn tất");
            }
            case "Đã hủy" -> {
                context.setVariable("headerColor", "#ef4444");
                context.setVariable("statusColor", "#ef4444");
                context.setVariable("title", "Lịch hẹn đã bị hủy");
            }
            default -> {
                context.setVariable("headerColor", "#0ea5e9");
                context.setVariable("statusColor", "#0ea5e9");
                context.setVariable("title", "Thông báo lịch hẹn");
            }
        }

        return templateEngine.process("template-email", context);
    }
}
