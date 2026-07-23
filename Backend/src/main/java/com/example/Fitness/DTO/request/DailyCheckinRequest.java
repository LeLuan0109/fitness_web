package com.example.Fitness.DTO.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DailyCheckinRequest {
    /** Lượng nước uống trong ngày (ml). */
    private Integer waterMl;

    /** Hôm nay có ăn đúng khẩu phần thực đơn không (Có/Không). Chỉ lưu để đánh giá sau. */
    private Boolean followedMenu;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate date;
}
