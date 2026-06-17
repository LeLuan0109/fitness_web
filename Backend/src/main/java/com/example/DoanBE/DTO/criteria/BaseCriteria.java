package com.example.DoanBE.DTO.criteria;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@Getter
@Setter
public class BaseCriteria {


    public static final String DESC_ORDER = "DESC";
    public static final String ASC_ORDER = "ASC";

    @NotBlank
    private String order = DESC_ORDER;

    @Min(0)
    private int page = 0;

    @Min(1)
    private int size = 10;

}
