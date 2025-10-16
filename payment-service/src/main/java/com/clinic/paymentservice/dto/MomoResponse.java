package com.clinic.paymentservice.dto;

import lombok.Data;

@Data
public class MomoResponse {
    private int resultCode;
    private String message;
    private String payUrl;
}
