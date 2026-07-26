package com.example.Fitness.Repository;

import com.example.Fitness.Model.ReminderConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReminderConfigRepository extends JpaRepository<ReminderConfig, Long> {
    Optional<ReminderConfig> findByReminderKey(String reminderKey);
}
