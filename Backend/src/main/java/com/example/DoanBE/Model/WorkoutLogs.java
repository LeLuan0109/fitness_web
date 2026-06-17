package com.example.DoanBE.Model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "WorkoutLogs")
@Getter
@Setter
@ToString
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutLogs extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actual_reps")
    private Integer actualReps;

    @Column(name = "actual_weights")
    private Double actualWeights;

    @Column(name = "rest")
    private Integer rest; // Thời gian nghỉ (giây)

    @Column(name = "actual_duration")
    private Integer actualDuration; // Thời gian tập (giây)

    @Column(name = "day_of_week_index")
    private Integer dayOfWeekIndex;

    @Column(name = "calories_burned")
    private Float caloriesBurned;

    @Column(name = "set_number")
    private Integer setNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_day_id")
    private WorkoutDay workoutDay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercises exercise;
}
