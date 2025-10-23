package com.clinic.paymentservice.controller;

import com.clinic.paymentservice.dto.MomoResponse;
import com.clinic.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public MomoResponse createPayment(@RequestParam String amount,
                                      @RequestParam String orderInfo) throws Exception {
        return paymentService.createPayment(amount, orderInfo);
    }

    @PostMapping("/notify")
    public String handleNotification(@RequestBody String callback) {
        // You can log and verify signature here
        return "IPN received";
    }
}
