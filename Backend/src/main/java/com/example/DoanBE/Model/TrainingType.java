package com.example.DoanBE.Model;

import com.example.DoanBE.Enum.TrainingTypeEnum;
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