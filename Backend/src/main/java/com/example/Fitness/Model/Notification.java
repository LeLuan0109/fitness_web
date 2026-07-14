package com.example.Fitness.Model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "notification")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;

    @Column(name = "is_read")
    private boolean isRead = false;

    // Loại thông báo: "SYSTEM", "WORKOUT", "SOCIAL" (Comment/Like)
    private String type;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "reference_url")
    private String referenceUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
