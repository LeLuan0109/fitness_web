package com.example.Fitness.Service;

import com.example.Fitness.Constants.FolderConstants;
import com.example.Fitness.DTO.request.ExerciseRequest;
import com.example.Fitness.DTO.response.ExerciseResponse;
import com.example.Fitness.DTO.response.common.SelectOptions;
import com.example.Fitness.DTO.response.exercises.ExercisesDetailResponse;
import com.example.Fitness.Mapper.ExerciseMapper;
import com.example.Fitness.Model.*;
import com.example.Fitness.Repository.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final TrainingTypeRepository trainingTypeRepository;
    private final MuscleGroupRepository muscleGroupRepository;
    private final FileUploadService cloudinaryService;
    private final EquipmentRepository equipmentRepository;
    private final ExerciseMapper exerciseMapper;
    private final WorkoutDayExercisesRepository workoutDayExercisesRepository;

    // --- LOGIC TẠO MỚI DÙNG DTO ---
    public ExerciseResponse createExercise(ExerciseRequest request) throws IOException {
        Exercises ex = new Exercises();

        ex.setName(request.getName());
        ex.setLevel(request.getLevel());
        ex.setAiExerciseKey(request.getAiExerciseKey());
        ex.setDescription(request.getDescription());
        ex.setMet(request.getMet());

        if (request.getThumbnail() != null && !request.getThumbnail().isEmpty()) {
            ex.setThumbnail(cloudinaryService.uploadImage(request.getThumbnail(), FolderConstants.EXERCISES));
        }
        if (request.getVideo() != null && !request.getVideo().isEmpty()) {
            ex.setVideoUrl(cloudinaryService.uploadVideo(request.getVideo(), FolderConstants.EXERCISES));
        }

        TrainingType type = trainingTypeRepository.findById(request.getTrainingTypeId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Training Type ID: " + request.getTrainingTypeId()));
        ex.setTrainingType(type);

        if (request.getEquipmentIds() != null && !request.getEquipmentIds().isEmpty()) {
            List<Equipment> equipments = equipmentRepository.findAllById(request.getEquipmentIds());
            ex.setEquipments(new HashSet<>(equipments));
        }

        Set<ExerciseMuscleGroup> exerciseMuscleGroups = new HashSet<>();

        if (request.getPrimaryMuscleGroupIds() != null) {
            List<MuscleGroup> pMuscles = muscleGroupRepository.findAllById(request.getPrimaryMuscleGroupIds());
            for (MuscleGroup mg : pMuscles) {
                exerciseMuscleGroups.add(ExerciseMuscleGroup.builder()
                        .exercise(ex).muscleGroup(mg).isPrimary(true).build());
            }
        }
        if (request.getSecondaryMuscleGroupIds() != null) {
            List<MuscleGroup> sMuscles = muscleGroupRepository.findAllById(request.getSecondaryMuscleGroupIds());
            for (MuscleGroup mg : sMuscles) {
                exerciseMuscleGroups.add(ExerciseMuscleGroup.builder()
                        .exercise(ex).muscleGroup(mg).isPrimary(false).build());
            }
        }
        ex.setExerciseMuscleGroups(exerciseMuscleGroups);

        if (request.getSteps() != null) {
            List<ExerciseStep> stepList = new ArrayList<>();
            for (int i = 0; i < request.getSteps().size(); i++) {
                stepList.add(ExerciseStep.builder()
                        .instruction(request.getSteps().get(i))
                        .stepOrder(i + 1)
                        .exercise(ex)
                        .build());
            }
            ex.setSteps(stepList);
        }

        if (request.getTips() != null) {
            ex.setTips(request.getTips().stream()
                    .map(t -> new ExerciseTip(null, t, ex))
                    .collect(Collectors.toList()));
        }
        if (request.getMistakes() != null) {
            ex.setMistakes(request.getMistakes().stream()
                    .map(m -> new ExerciseMistake(null, m, ex))
                    .collect(Collectors.toList()));
        }
        if (request.getBenefits() != null) {
            ex.setBenefits(request.getBenefits().stream()
                    .map(b -> new ExerciseBenefit(null, b, ex))
                    .collect(Collectors.toList()));
        }

        return mapToResponse(exerciseRepository.save(ex));
    }

    public Page<ExerciseResponse> getExercises(String name, String level, Long muscleId, Long typeId, Pageable pageable) {
        Specification<Exercises> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isFalse(root.get("isDeleted")));

            if (name != null && !name.isEmpty())
                predicates.add(cb.like(root.get("name"), "%" + name + "%"));

            if (level != null && !level.isEmpty())
                predicates.add(cb.equal(root.get("level"), level));

            if (typeId != null)
                predicates.add(cb.equal(root.get("trainingType").get("id"), typeId));

            if (muscleId != null) {
                Join<Exercises, ExerciseMuscleGroup> emgJoin = root.join("exerciseMuscleGroups");
                predicates.add(cb.equal(emgJoin.get("muscleGroup").get("id"), muscleId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return exerciseRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    public ExerciseResponse updateExercise(Long id, ExerciseRequest request) throws IOException {
        Exercises ex = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập ID: " + id));

        // Cập nhật thông tin cơ bản
        if (request.getName() != null) ex.setName(request.getName());
        if (request.getLevel() != null) ex.setLevel(request.getLevel());
        if (request.getDescription() != null) ex.setDescription(request.getDescription());

        // Cập nhật Training Type
        if (request.getTrainingTypeId() != null) {
            TrainingType type = trainingTypeRepository.findById(request.getTrainingTypeId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Training Type"));
            ex.setTrainingType(type);
        }

        // Cập nhật File Upload (Có xóa file cũ)
        if (request.getThumbnail() != null && !request.getThumbnail().isEmpty()) {
            if (ex.getThumbnail() != null) cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(ex.getThumbnail()));
            ex.setThumbnail(cloudinaryService.uploadImage(request.getThumbnail(), FolderConstants.EXERCISES));
        }
        if (request.getVideo() != null && !request.getVideo().isEmpty()) {
            if (ex.getVideoUrl() != null) cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(ex.getVideoUrl()));
            ex.setVideoUrl(cloudinaryService.uploadVideo(request.getVideo(), FolderConstants.EXERCISES));
        }

        // Cập nhật Equipment (Replace toàn bộ)
        if (request.getEquipmentIds() != null) {
            ex.getEquipments().clear();
            List<Equipment> equipments = equipmentRepository.findAllById(request.getEquipmentIds());
            ex.getEquipments().addAll(equipments);
        }

        // Cập nhật Muscle Groups (Replace toàn bộ - Xóa cũ thêm mới)
        if (request.getPrimaryMuscleGroupIds() != null || request.getSecondaryMuscleGroupIds() != null) {
            ex.getExerciseMuscleGroups().clear();

            if (request.getPrimaryMuscleGroupIds() != null) {
                for (MuscleGroup mg : muscleGroupRepository.findAllById(request.getPrimaryMuscleGroupIds())) {
                    ex.getExerciseMuscleGroups().add(ExerciseMuscleGroup.builder().exercise(ex).muscleGroup(mg).isPrimary(true).build());
                }
            }
            if (request.getSecondaryMuscleGroupIds() != null) {
                for (MuscleGroup mg : muscleGroupRepository.findAllById(request.getSecondaryMuscleGroupIds())) {
                    ex.getExerciseMuscleGroups().add(ExerciseMuscleGroup.builder().exercise(ex).muscleGroup(mg).isPrimary(false).build());
                }
            }
        }

        if (request.getSteps() != null) {
            ex.getSteps().clear();
            for (int i = 0; i < request.getSteps().size(); i++) {
                ex.getSteps().add(ExerciseStep.builder().instruction(request.getSteps().get(i)).stepOrder(i + 1).exercise(ex).build());
            }
        }

        if (request.getTips() != null) {
            ex.getTips().clear();
            ex.getTips().addAll(request.getTips().stream().map(t -> new ExerciseTip(null, t, ex)).toList());
        }
        if (request.getMistakes() != null) {
            ex.getMistakes().clear();
            ex.getMistakes().addAll(request.getMistakes().stream().map(t -> new ExerciseMistake(null, t, ex)).toList());
        }
        if (request.getBenefits() != null) {
            ex.getBenefits().clear();
            ex.getBenefits().addAll(request.getBenefits().stream().map(t -> new ExerciseBenefit(null, t, ex)).toList());
        }

        return mapToResponse(exerciseRepository.save(ex));
    }

    public void deleteExercise(Long id) {
        boolean isUsed = workoutDayExercisesRepository.existsByExercisesId(id);

        if (isUsed) {
            throw new RuntimeException("Bài tập này đang được sử dụng. Không thể xóa!");
        }
        Exercises ex = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập với ID: " + id));

        ex.setDeleted(true);
        exerciseRepository.save(ex);
    }

    public ExerciseResponse getExerciseDetail(Long id) {
        Exercises ex = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập với ID: " + id));
        return mapToResponse(ex);
    }

    public ExercisesDetailResponse getExerciseDetailResponse(Long id) {
        Exercises ex = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập với ID: " + id));

        return exerciseMapper.toDetailResponse(ex);
    }

    // Helper: Entity -> Response DTO
    private ExerciseResponse mapToResponse(Exercises ex) {
        return ExerciseResponse.builder()
                .id(ex.getId())
                .name(ex.getName())
                .level(ex.getLevel())
                .aiExerciseKey(ex.getAiExerciseKey())
                .thumbnail(ex.getThumbnail())
                .videoUrl(ex.getVideoUrl())
                .description(ex.getDescription())
                .trainingType(ex.getTrainingType() != null ? ex.getTrainingType().getName() : "")

                // Map Equipment
                .equipments(nullSafe(ex.getEquipments()).stream().map(Equipment::getName).collect(Collectors.toList()))

                // Map Muscle Groups (Chia làm 2 list)
                .primaryMuscles(nullSafe(ex.getExerciseMuscleGroups()).stream()
                        .filter(ExerciseMuscleGroup::isPrimary)
                        .map(emg -> emg.getMuscleGroup().getName()).collect(Collectors.toList()))
                .secondaryMuscles(nullSafe(ex.getExerciseMuscleGroups()).stream()
                        .filter(emg -> !emg.isPrimary())
                        .map(emg -> emg.getMuscleGroup().getName()).collect(Collectors.toList()))

                // Map Lists Text
                .steps(nullSafe(ex.getSteps()).stream().map(ExerciseStep::getInstruction).collect(Collectors.toList()))
                .tips(nullSafe(ex.getTips()).stream().map(ExerciseTip::getContent).collect(Collectors.toList()))
                .mistakes(nullSafe(ex.getMistakes()).stream().map(ExerciseMistake::getContent).collect(Collectors.toList()))
                .benefits(nullSafe(ex.getBenefits()).stream().map(ExerciseBenefit::getContent).collect(Collectors.toList()))

                .build();
    }

    private static <T> java.util.Collection<T> nullSafe(java.util.Collection<T> collection) {
        return collection != null ? collection : java.util.Collections.emptyList();
    }

    public List<ExerciseResponse> getRelatedExercises(Long exerciseId) {
        Exercises currentExercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        List<Long> muscleIds = currentExercise.getExerciseMuscleGroups().stream()
                .map(emg -> emg.getMuscleGroup().getId())
                .collect(Collectors.toList());

        Long typeId = currentExercise.getTrainingType() != null
                ? currentExercise.getTrainingType().getId()
                : null;

        String level = currentExercise.getLevel();
        Pageable limit = PageRequest.of(0, 4);
        List<Exercises> relatedExercises = exerciseRepository.findRelatedExercisesPriority(
                exerciseId,
                muscleIds.isEmpty() ? List.of(-1L) : muscleIds,
                typeId,
                level,
                limit
        );
        return relatedExercises.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SelectOptions> getExerciseOptions() {
        List<Exercises> exercises = exerciseRepository.findAll();
        return exercises.stream().map(exerciseMapper::toSelectOptions).toList();
    }
}