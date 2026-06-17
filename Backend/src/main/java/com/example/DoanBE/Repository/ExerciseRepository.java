package com.example.DoanBE.Repository;

import com.example.DoanBE.Model.Exercises;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercises, Long>, JpaSpecificationExecutor<Exercises> {
    @Query("SELECT e FROM Exercises e " +
            "LEFT JOIN e.exerciseMuscleGroups emg " +
            "WHERE e.id <> :currentId " +
            "AND e.isDeleted = false " +
            "AND (" +
            "emg.muscleGroup.id IN :muscleIds " +
            "OR e.trainingType.id = :typeId " +
            "OR e.level = :level" +
            ") " +
            "GROUP BY e.id " +
            "ORDER BY " +
            // Ưu tiên 1: Đếm số lượng nhóm cơ trùng
            "SUM(CASE WHEN emg.muscleGroup.id IN :muscleIds THEN 1 ELSE 0 END) DESC, " +
            // Ưu tiên 2: Trùng loại hình tập luyện
            "(CASE WHEN e.trainingType.id = :typeId THEN 1 ELSE 0 END) DESC, " +
            // Ưu tiên 3: Trùng cấp độ
            "(CASE WHEN e.level = :level THEN 1 ELSE 0 END) DESC")
    List<Exercises> findRelatedExercisesPriority(
            @Param("currentId") Long currentId,
            @Param("muscleIds") List<Long> muscleIds,
            @Param("typeId") Long typeId,
            @Param("level") String level,
            Pageable pageable
    );
}