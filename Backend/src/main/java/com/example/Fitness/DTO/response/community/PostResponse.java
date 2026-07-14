package com.example.Fitness.DTO.response.community;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class PostResponse {

    private Long id;
    private String title;
    private String name;
    private String content;
    private String imageUrl;
    private String videoUrl;

    private Long userId;
    private String userName;
    private String userAvatarUrl;

    private Long likeCount;
    private Long commentCount;

    private Boolean liked;
    private Boolean canEdit;
    private Boolean canDelete;

    private LocalDateTime createAt;

}
