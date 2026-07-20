package com.example.Fitness.DTO.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AddFoodLogRequest {
    @NotNull(message = "dishId không được để trống")
    private Long dishId;

    private Integer quantity = 1;

    // Ngày ăn (dd/MM/yyyy); nếu null sẽ mặc định hôm nay (xử lý ở service).
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate date;

    // BREAKFAST / LUNCH / DINNER / SNACK / OTHER
    private String mealType;
}
