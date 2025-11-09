package com.clinic.paymentservice.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.paymentservice.config.MomoConfig;
import com.clinic.paymentservice.service.MomoService;
import com.clinic.paymentservice.util.CryptoUtil;

import jakarta.servlet.http.HttpServletResponse;


@CrossOrigin
@RestController
@RequestMapping("/api/momo")
public class MomoController {

    private final MomoService momoService;

    private final MomoConfig momoConfig;

    public MomoController(MomoService momoService, MomoConfig momoConfig) {
        this.momoService = momoService;
        this.momoConfig = momoConfig;
    }

    @PostMapping("/create")
    public Map<String, Object> createPayment(@RequestBody Map<String, Object> body,  HttpServletResponse resp) throws Exception {
        long amount = Long.parseLong(body.get("amount").toString());
        String orderInfo = (String) body.get("orderInfo");
        return momoService.createPayment(amount, orderInfo);
    }

    @GetMapping("/payment/redirect")
    public String handleRedirect(@RequestParam String orderId,
                                @RequestParam String requestId,
                                @RequestParam int errorCode,
                                @RequestParam String message,
                                @RequestParam String transId) {
        if (errorCode == 0) {
            // Payment successful
            // Update order in your DB if needed (optional: verify via IPN)
            return "Payment successful! Order ID: " + orderId;
        } else {
            // Payment failed
            return "Payment failed: " + message;
        }
    }

    // POST ipnUrl nhận body JSON của MoMo
    @PostMapping("/ipn")
    public Map<String, Object> handleIpn(@RequestBody Map<String, Object> body, HttpServletResponse resp) throws Exception {
        // Lấy fields MoMo gửi
        String partnerCode = (String) body.get("partnerCode");
        String requestId = (String) body.get("requestId");
        String orderId = (String) body.get("orderId");
        String message = (String) body.get("message");
        long responseTime = ((Number) body.get("responseTime")).longValue();
        int resultCode = ((Number) body.get("resultCode")).intValue();
        String transId = String.valueOf(body.get("transId"));
        String extraData = (String) body.get("extraData");
        String signature = (String) body.get("signature");

        // Build raw string theo thứ tự docs (ví dụ trong docs: accessKey, extraData, message, orderId, partnerCode, requestId, responseTime, resultCode)
        // **Chú ý**: dùng đúng chuỗi và thứ tự docs ghi.
        String raw = "accessKey=" + momoConfig.getAccessKey() +
                "&extraData=" + extraData +
                "&message=" + message +
                "&orderId=" + orderId +
                "&partnerCode=" + partnerCode +
                "&requestId=" + requestId +
                "&responseTime=" + responseTime +
                "&resultCode=" + resultCode;

        String expectedSignature = CryptoUtil.hmacSHA256(momoConfig.getSecretKey(), raw);

        if (!expectedSignature.equals(signature)) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return Map.of("message", "Invalid signature");
        }

        // Nếu hợp lệ: cập nhật trạng thái đơn (resultCode==0 là thành công)
        // Trả HTTP 200 với body JSON theo spec (MoMo yêu cầu HTTP 200)
        return Map.of("partnerCode", partnerCode, "requestId", requestId, "orderId", orderId, "resultCode", resultCode, "message", "Success");
    }

    @GetMapping("/generate-ipn")
    public Map<String, Object> generateIpn() throws Exception {
        // Example data
        String requestId = "test-request-001";
        String orderId = "order123";
        long responseTime = System.currentTimeMillis();
        int resultCode = 0; // 0 = success
        String message = "Success";
        String extraData = "";
        long transId = 987654321;
        long amount = 10000;

        // Build raw string for signature
        String raw = "accessKey=" + momoConfig.getAccessKey() +
                     "&extraData=" + extraData +
                     "&message=" + message +
                     "&orderId=" + orderId +
                     "&partnerCode=" + momoConfig.getPartnerCode() +
                     "&requestId=" + requestId +
                     "&responseTime=" + responseTime +
                     "&resultCode=" + resultCode;

        // Generate signature
        String signature = CryptoUtil.hmacSHA256(momoConfig.getSecretKey(), raw);

        // Build IPN payload
        Map<String, Object> ipnPayload = new HashMap<>();
        ipnPayload.put("partnerCode", momoConfig.getPartnerCode());
        ipnPayload.put("requestId", requestId);
        ipnPayload.put("orderId", orderId);
        ipnPayload.put("amount", amount);
        ipnPayload.put("orderInfo", "Demo payment");
        ipnPayload.put("orderType", "momo_wallet");
        ipnPayload.put("transId", transId);
        ipnPayload.put("resultCode", resultCode);
        ipnPayload.put("message", message);
        ipnPayload.put("extraData", extraData);
        ipnPayload.put("responseTime", responseTime);
        ipnPayload.put("signature", signature);

        return ipnPayload;
    }

    @PostMapping("/query")
    public Map<String, Object> queryPayment(@RequestBody Map<String, Object>body, HttpServletResponse resp) throws Exception {
        String orderId = (String) body.get("orderId");
        String requestId = (String) body.get("requestId");
        return momoService.queryPayment(orderId, requestId);
    }

}
