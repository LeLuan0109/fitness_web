package com.example.Fitness.Model.Nutrition;

import com.example.Fitness.Model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Ghi nhớ user đã chọn thực đơn nào cho 1 ngày cụ thể (khi bấm "Dùng thực đơn này cho hôm nay").
 * Dùng để đối chiếu "đúng kế hoạch" thay vì đoán theo menu tạo gần nhất.
 */
@Entity
@Table(name = "daily_menu_selection")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyMenuSelection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "log_date")
    private LocalDate logDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id")
    private Menu menu;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
