package com.example.Fitness.Repository;

import com.example.Fitness.Model.Nutrition.Ingredient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    boolean existsByName(String name);

    // Tìm kiếm theo tên (có phân trang)
    Page<Ingredient> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
