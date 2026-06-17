package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.response.common.SelectOptions;
import com.example.DoanBE.Mapper.MuscleGroupMapper;
import com.example.DoanBE.Model.MuscleGroup;
import com.example.DoanBE.Repository.MuscleGroupRepository;
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
