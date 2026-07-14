package com.example.Fitness.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostRequest {

    private String title;

    private String name;

    @NotNull(message = "Nội dung không được để trống")
    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    private MultipartFile video;

    private MultipartFile image;

    private boolean deleteImage = false;
    private boolean deleteVideo = false;

}
