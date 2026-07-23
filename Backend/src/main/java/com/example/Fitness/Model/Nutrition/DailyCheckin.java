package com.example.Fitness.Model.Nutrition;

import com.example.Fitness.Model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Ghi nhận theo ngày: lượng nước uống + có ăn đúng khẩu phần thực đơn không.
 * followed_menu chỉ THU THẬP để đánh giá sau, chưa dùng vào tính toán tiến độ.
 */
@Entity
@Table(name = "daily_checkin")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyCheckin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "log_date")
    private LocalDate logDate;

    @Column(name = "water_ml")
    private Integer waterMl;

    /** 1 = Có ăn đúng thực đơn, 0 = Không. Null = chưa trả lời. */
    @Column(name = "followed_menu")
    private Boolean followedMenu;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.waterMl == null) this.waterMl = 0;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
