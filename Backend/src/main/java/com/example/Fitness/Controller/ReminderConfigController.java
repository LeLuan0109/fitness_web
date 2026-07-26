package com.example.Fitness.Controller;

import com.example.Fitness.DTO.response.common.ApiResponse;
import com.example.Fitness.Model.ReminderConfig;
import com.example.Fitness.Repository.ReminderConfigRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;

/** Cấu hình giờ nhắc nhở (VD: giờ nhắc ghi nhật ký ăn) — chỉ admin được xem/sửa. */
@RestController
@RequestMapping("${api.prefix}/admin/reminder-configs")
@Tag(name = "Reminder Config Controller")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ReminderConfigController {

    private final ReminderConfigRepository reminderConfigRepository;

    @GetMapping("/{reminderKey}")
    public ResponseEntity<?> getConfig(@PathVariable String reminderKey) {
        ReminderConfig config = reminderConfigRepository.findByReminderKey(reminderKey)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy cấu hình nhắc nhở"));
        return ResponseEntity.ok(ApiResponse.builder().status(true).data(config).build());
    }

    @PutMapping("/{reminderKey}")
    public ResponseEntity<?> updateConfig(@PathVariable String reminderKey, @RequestBody UpdateReminderConfigRequest request) {
        ReminderConfig config = reminderConfigRepository.findByReminderKey(reminderKey)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy cấu hình nhắc nhở"));
        if (request.getReminderTime() != null) {
            config.setReminderTime(request.getReminderTime());
        }
        if (request.getEnabled() != null) {
            config.setEnabled(request.getEnabled());
        }
        reminderConfigRepository.save(config);
        return ResponseEntity.ok(ApiResponse.builder().status(true).data(config).build());
    }

    @Data
    public static class UpdateReminderConfigRequest {
        private LocalTime reminderTime;
        private Boolean enabled;
    }
}
