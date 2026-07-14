package com.example.Fitness.Service;

import com.example.Fitness.DTO.response.common.SelectOptions;
import com.example.Fitness.Mapper.MuscleGroupMapper;
import com.example.Fitness.Model.MuscleGroup;
import com.example.Fitness.Repository.MuscleGroupRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MuscleGroupService {
    private final MuscleGroupRepository muscleGroupRepository;
    private final MuscleGroupMapper muscleGroupMapper;

    public List<SelectOptions> getMuscleGroupSelectOptions() {
        List<MuscleGroup> muscleGroups = muscleGroupRepository.findAll();
        return muscleGroups.stream().map(muscleGroupMapper::toSelectOptions).toList();
    }
}
