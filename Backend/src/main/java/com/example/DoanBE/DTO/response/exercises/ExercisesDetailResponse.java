package com.example.DoanBE.DTO.response.exercises;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ExercisesDetailResponse {
    private Long id;
    private String name;
    private String level;
    private String thumbnail;
    private String videoUrl;
    private String description;
    private String benefit;
    private Float met;
    private Long trainingTypeId;
    private List<Long> equipments;

    private List<Long> primaryMusclesIds;   // Cơ chính
    private List<Long> secondaryMusclesIds; //Cơ phụ

    private List<String> steps;     // Các bước tập
    private List<String> tips;      // Mẹo
    private List<String> mistakes;  // Sai lầm thường gặp
    private List<String> benefits;
}
