package com.example.DoanBE.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exercise_benefit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseBenefit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    private Exercises exercise;
}
