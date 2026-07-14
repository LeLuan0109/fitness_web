package com.example.Fitness.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exercise_mistake")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseMistake {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    private Exercises exercise;
}
