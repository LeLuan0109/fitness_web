package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.response.common.SelectOptions;
import com.example.DoanBE.Mapper.TrainingTypeMapper;
import com.example.DoanBE.Model.TrainingType;
import com.example.DoanBE.Repository.TrainingTypeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TrainingTypeService {
    private final TrainingTypeRepository trainingTypeRepository;
    private final TrainingTypeMapper trainingTypeMapper;

    public List<SelectOptions> getTrainingTypeOptions() {
        List<TrainingType> trainingTypes = trainingTypeRepository.findAll();
        return trainingTypes.stream().map(trainingTypeMapper::toSelectOptions).toList();
    }
}
