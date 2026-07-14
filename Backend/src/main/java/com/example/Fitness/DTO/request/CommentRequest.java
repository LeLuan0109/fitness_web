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
public class CommentRequest {

    @NotNull(message = "ID bài viết không được để trống")
    private Long postId;

    @NotNull(message = "Nội dung không được để trống")
    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    private MultipartFile image;

    private boolean deleteImage = false;

}
