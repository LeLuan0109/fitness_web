package com.example.DoanBE.DTO.response.Nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishIngredientResponse {
    private Long id;
    private Float quantity;           // Số lượng (VD: 200)
    private String unit;              // Đơn vị trong món (VD: gram)
    private String preparationNote;   // Ghi chú (VD: Thái hạt lựu)

    // Nested Object: Chứa thông tin chi tiết nguyên liệu
    private IngredientResponse ingredient;
}
