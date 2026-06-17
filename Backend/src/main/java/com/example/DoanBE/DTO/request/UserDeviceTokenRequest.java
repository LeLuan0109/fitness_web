package com.example.DoanBE.DTO.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDeviceTokenRequest {
    private String token;
    private String deviceType;
}
