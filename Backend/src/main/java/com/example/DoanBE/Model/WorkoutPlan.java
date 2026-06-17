package com.example.DoanBE.Model;

import com.example.DoanBE.Enum.DifficultyLevel;
import com.example.DoanBE.Enum.FitnessGoal;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "workoutplan")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutPlan extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "is_default")
    private Boolean isDefault;

    @Column(name = "days_per_week")
    private Integer daysPerWeek;

    @Column(name = "duration_week")
    private Integer durationWeek;

    @Column(name = "start_date")
    private LocalDate startDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

     @Enumerated(EnumType.STRING)
     @Column(name = "target_goal")
     private FitnessGoal targetGoal;

     @Enumerated(EnumType.STRING)
     @Column(name = "difficulty_level")
     private DifficultyLevel difficultyLevel;

     @Column(name = "is_deleted")
     private boolean isDeleted;

    @OneToMany(mappedBy = "workoutPlan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WorkoutDay> workoutDays;
}
