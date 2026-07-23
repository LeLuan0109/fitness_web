package com.example.Fitness.DTO.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AddFoodLogRequest {
    /** Tùy chọn: món trong catalog (để tham chiếu tên/ảnh). Có thể null nếu ăn món khác. */
    private Long dishId;

    /** Tên món tự nhập khi ăn món ngoài catalog. */
    private String customName;

    /** Số khẩu phần (tùy chọn, mặc định 1) — chỉ dùng khi KHÔNG nhập calo thực tế. */
    private Integer quantity = 1;

    /** SỐ CALO THỰC TẾ nạp vào (ưu tiên). Người dùng nhập trực tiếp. */
    private Float actualCalories;

    private Float actualProtein;
    private Float actualCarbs;
    private Float actualFat;

    // Ngày ăn (dd/MM/yyyy); nếu null sẽ mặc định hôm nay (xử lý ở service).
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate date;

    // BREAKFAST / LUNCH / DINNER / SNACK / OTHER
    private String mealType;
}
