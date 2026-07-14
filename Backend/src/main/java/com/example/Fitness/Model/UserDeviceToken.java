package com.example.Fitness.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_device_token")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDeviceToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token; // Token do Firebase cấp cho Frontend

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "device_type")
    private String deviceType;
}
