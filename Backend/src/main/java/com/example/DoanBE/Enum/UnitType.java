package com.example.DoanBE.Enum;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum UnitType {
    // Đơn vị khối lượng
    GRAM("g", "Gram (g)"),
    KILOGRAM("kg", "Kilogram (kg)"),

    // Đơn vị thể tích
    MILLILITER("ml", "Milliliter (ml)"),
    LITER("l", "Lít (l)"),

    // Đơn vị ước lượng (Serving size)
    PIECE("cái", "Cái / Quả / Củ"),
    SLICE("lát", "Lát (Slices)"),
    CUP("cup", "Cốc / Chén (Cup)"),
    BOWL("bát", "Bát (Bowl)"),
    TEASPOON("tsp", "Thìa cà phê (tsp)"),
    TABLESPOON("tbsp", "Thìa canh (tbsp)"),
    CAN("lon", "Lon / Hộp");

    private final String value; // Giá trị lưu xuống DB (VD: "g")
    private final String label; // Giá trị hiển thị cho User (VD: "Gram (g)")
}
