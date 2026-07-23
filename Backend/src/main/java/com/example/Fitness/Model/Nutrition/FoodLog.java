package com.example.Fitness.Model.Nutrition;

import com.example.Fitness.Model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Nhật ký ăn uống: một món đã ăn trong một ngày.
 */
@Entity
@Table(name = "food_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dish_id")
    private Dish dish;

    private Integer quantity;

    /** Tên món tự nhập khi không chọn từ catalog (ăn món khác). */
    @Column(name = "custom_name")
    private String customName;

    /** Số calo THỰC TẾ người dùng nạp (ưu tiên dùng nếu có, thay cho dish×quantity). */
    @Column(name = "actual_calories")
    private Float actualCalories;

    @Column(name = "actual_protein")
    private Float actualProtein;

    @Column(name = "actual_carbs")
    private Float actualCarbs;

    @Column(name = "actual_fat")
    private Float actualFat;

    @Column(name = "log_date")
    private LocalDate logDate;

    @Column(name = "meal_type")
    private String mealType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.quantity == null) this.quantity = 1;
        if (this.mealType == null) this.mealType = "OTHER";
    }
}
