package com.example.DoanBE.DTO.response.community;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private String imageUrl;

    private Long userId;
    private String userName;
    private String userAvatarUrl;

    private Long likeCount;
    private Boolean liked;

    private Boolean canEdit;
    private Boolean canDelete;



    private LocalDateTime createdAt;
}
