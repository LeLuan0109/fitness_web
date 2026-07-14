package com.example.Fitness.Mapper;

import com.example.Fitness.DTO.response.community.CommentResponse;
import com.example.Fitness.Model.Comments;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.username")
    @Mapping(target = "userAvatarUrl", source = "user.avatar")
    @Mapping(target = "imageUrl", source = "image")
    @Mapping(target = "likeCount", ignore = true)
    @Mapping(target = "liked", ignore = true)
    @Mapping(target = "canEdit", ignore = true)
    @Mapping(target = "canDelete", ignore = true)
    CommentResponse toResponse(Comments comment);
}
