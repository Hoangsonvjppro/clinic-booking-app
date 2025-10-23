package com.clinic.paymentservice.service;

import com.clinic.paymentservice.config.MomoConfig;
import com.clinic.paymentservice.util.CryptoUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MomoService {

    private final RestTemplate rest;
    private final ObjectMapper mapper;
    private final MomoConfig momoConfig;

    // Inject config
    public MomoService(MomoConfig momoConfig) {
        this.momoConfig = momoConfig;
        this.rest = new RestTemplate();
        this.mapper = new ObjectMapper();
    }

    public Map<String, Object> createPayment(long amount, String orderInfo) throws Exception {
        String orderId = UUID.randomUUID().toString();
        String requestId = UUID.randomUUID().toString();
        String requestType = "captureWallet"; // ví dụ: thanh toán ví MoMo
        String extraData = "";

        // Build raw signature theo docs MoMo
        String rawSignature = "accessKey=" + momoConfig.getAccessKey() +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + momoConfig.getIpnUrl() +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + momoConfig.getPartnerCode() +
                "&redirectUrl=" + momoConfig.getRedirectUrl() +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String signature = CryptoUtil.hmacSHA256(momoConfig.getSecretKey(), rawSignature);

        // Build request body
        Map<String, Object> body = new HashMap<>();
        body.put("partnerCode", momoConfig.getPartnerCode());
        body.put("partnerName", "ClinicPayment");
        body.put("storeId", "ClinicStore");
        body.put("requestId", requestId);
        body.put("amount", amount);
        body.put("orderId", orderId);
        body.put("orderInfo", orderInfo);
        body.put("redirectUrl", momoConfig.getRedirectUrl());
        body.put("ipnUrl", momoConfig.getIpnUrl());
        body.put("lang", "vi");
        body.put("extraData", extraData);
        body.put("requestType", requestType);
        body.put("signature", signature);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);


        HttpEntity<Map<String, Object>> req = new HttpEntity<>(body, headers);
        ResponseEntity<String> resp = rest.postForEntity(momoConfig.getEndpoint(), req, String.class);

        if (resp.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> json = mapper.readValue(resp.getBody(), Map.class);
            json.put("signature", signature);
            return json;
            // return (String) json.get("payUrl");
        } else {
            throw new RuntimeException("Momo API error: HTTP " + resp.getStatusCodeValue());
        }
    }

    public Map<String, Object> queryPayment(String orderId, String requestId) throws Exception {
        // Build raw signature string as specified
        String raw = "accessKey=" + momoConfig.getAccessKey()
                + "&orderId=" + orderId
                + "&partnerCode=" + momoConfig.getPartnerCode()
                + "&requestId=" + requestId;

        String signature = CryptoUtil.hmacSHA256(momoConfig.getSecretKey(), raw);

        // Build the request JSON
        Map<String, Object> body = new HashMap<>();
        body.put("partnerCode", momoConfig.getPartnerCode());
        body.put("requestId", requestId);
        body.put("orderId", orderId);
        body.put("lang", "vi");  // or "en"
        body.put("signature", signature);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> req = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = rest.postForEntity(
            momoConfig.getQuery(),  // make sure this matches your config
            req,
            Map.class
        );
        
        return response.getBody();
    }
}
