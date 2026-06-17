package com.example.DoanBE.DTO.response.workout_logs;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class WorkoutLogResponse {
    private Long id;
    private String exerciseName;
    private String thumbnail;
    private Integer setNumber;
    private Integer reps;
    private Double weight;
    private Integer duration;
    private Float caloriesBurned;
}
