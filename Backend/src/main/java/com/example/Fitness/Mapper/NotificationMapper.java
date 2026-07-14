package com.example.Fitness.Mapper;

import com.example.Fitness.DTO.response.notification.NotificationResponse;
import com.example.Fitness.Model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(source = "read", target = "isRead")
    NotificationResponse toNotificationResponse(Notification notification);
}
