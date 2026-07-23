package com.example.Fitness.Model.Nutrition;

import com.example.Fitness.Model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** Theo dõi cân nặng theo thời gian (mỗi ngày 1 bản ghi). */
@Entity
@Table(name = "weight_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeightLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Double weight;

    @Column(name = "log_date")
    private LocalDate logDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
