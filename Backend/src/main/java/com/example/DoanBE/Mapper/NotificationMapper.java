package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.response.notification.NotificationResponse;
import com.example.DoanBE.Model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(source = "read", target = "isRead")
    NotificationResponse toNotificationResponse(Notification notification);
}
