package com.example.DoanBE.Model;

import jakarta.persistence.*;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "musclegroup")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MuscleGroup extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}