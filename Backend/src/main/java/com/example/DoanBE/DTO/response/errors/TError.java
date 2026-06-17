package com.example.DoanBE.DTO.response.errors;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TError {
    private String code;
    private String message;
    private List<ErrorDetail> details;
}
