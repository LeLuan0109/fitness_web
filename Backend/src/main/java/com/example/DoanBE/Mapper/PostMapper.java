package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.response.community.PostResponse;
import com.example.DoanBE.Model.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.username")
    @Mapping(target = "userAvatarUrl", source = "user.avatar")
    @Mapping(target = "imageUrl", source = "image")
    @Mapping(target = "videoUrl", source = "video")
    @Mapping(target = "likeCount", ignore = true)
    @Mapping(target = "commentCount", ignore = true)
    @Mapping(target = "liked", ignore = true)
    @Mapping(target = "canEdit", ignore = true)
    @Mapping(target = "canDelete", ignore = true)

    PostResponse toResponse(Post post);

}

