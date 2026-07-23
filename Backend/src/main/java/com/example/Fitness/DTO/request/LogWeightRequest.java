package com.example.Fitness.DTO.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LogWeightRequest {
    @NotNull(message = "Cân nặng không được để trống")
    @Min(value = 1, message = "Cân nặng không hợp lệ")
    private Double weight;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate date;
}
