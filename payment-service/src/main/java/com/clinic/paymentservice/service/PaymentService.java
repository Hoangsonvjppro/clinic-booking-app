package com.clinic.paymentservice.service;

import com.clinic.paymentservice.config.MomoConfig;
import com.clinic.paymentservice.dto.MomoRequest;
import com.clinic.paymentservice.dto.MomoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.clinic.paymentservice.util.CryptoUtil;
import java.util.UUID;



@Service
public class PaymentService {
    private final MomoConfig momoConfig;

    public PaymentService(MomoConfig momoConfig) {
        this.momoConfig = momoConfig;
    }

    public MomoResponse createPayment(String amount, String orderInfo) throws Exception {
        String orderId = UUID.randomUUID().toString();
        String requestId = UUID.randomUUID().toString();

        String rawSignature = String.format(
                "accessKey=%s&amount=%s&extraData=&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=captureWallet",
                momoConfig.getAccessKey(), amount, momoConfig.getIpnUrl(), orderId, orderInfo,
                momoConfig.getPartnerCode(), momoConfig.getRedirectUrl(), requestId);

        String signature = CryptoUtil.hmacSHA256(rawSignature, momoConfig.getSecretKey());

        MomoRequest request = new MomoRequest();
        request.setPartnerCode(momoConfig.getPartnerCode());
        request.setAccessKey(momoConfig.getAccessKey());
        request.setRequestId(requestId);
        request.setAmount(amount);
        request.setOrderId(orderId);
        request.setOrderInfo(orderInfo);
        request.setRedirectUrl(momoConfig.getRedirectUrl());
        request.setIpnUrl(momoConfig.getIpnUrl());
        request.setRequestType("captureWallet");
        request.setSignature(signature);

        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.postForObject(momoConfig.getEndpoint(), request, MomoResponse.class);
    }
}
