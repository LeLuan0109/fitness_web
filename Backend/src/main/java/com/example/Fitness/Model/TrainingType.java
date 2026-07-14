package com.example.Fitness.Model;

import com.example.Fitness.Enum.TrainingTypeEnum;
import jakarta.persistence.*;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "trainingtype")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingType extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}