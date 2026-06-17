package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.response.common.SelectOptions;
import com.example.DoanBE.Mapper.EquipmentMapper;
import com.example.DoanBE.Model.Equipment;
import com.example.DoanBE.Model.TrainingType;
import com.example.DoanBE.Repository.EquipmentRepository;
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
