package com.example.Fitness.DTO.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ApplyMenuRequest {
    /** Thực đơn muốn dùng cho ngày này. */
    private Long menuId;

    /** Ngày áp dụng (dd/MM/yyyy); nếu null sẽ mặc định hôm nay (xử lý ở service). */
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate date;
}
