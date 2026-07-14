package com.example.Fitness.Service;

import com.example.Fitness.DTO.response.common.SelectOptions;
import com.example.Fitness.Mapper.EquipmentMapper;
import com.example.Fitness.Model.Equipment;
import com.example.Fitness.Model.TrainingType;
import com.example.Fitness.Repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;
    private final EquipmentMapper equipmentMapper;

    public List<SelectOptions> getEquipmentOptions() {
        List<Equipment> equipmentList = equipmentRepository.findAll();
        return equipmentList.stream().map(equipmentMapper::toSelectOptions).toList();
    }
}
