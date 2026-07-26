package com.example.Fitness.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

/** Cấu hình giờ nhắc nhở (VD: FOOD_LOG_REMINDER) — 1 dòng/loại nhắc, chỉnh được qua API admin. */
@Entity
@Table(name = "reminder_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReminderConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reminder_key", unique = true)
    private String reminderKey;

    @Column(name = "reminder_time")
    private LocalTime reminderTime;

    private Boolean enabled;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
