package com.example.DoanBE.DTO.response.common;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChartDataResponseByDate {
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate date;
    private Double value1;
    private Double value2;
}
