package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.response.auth.BasicInfoResponse;
import com.example.DoanBE.DTO.response.auth.RegisterResponse;
import com.example.DoanBE.DTO.response.user.UserResponse;
import com.example.DoanBE.Model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {RoleMapper.class})
public interface UserMapper {
    RegisterResponse userToRegisterResponse(User user);
    @Mapping(target = "isLocked", source = "locked")
    UserResponse userToUserResponse(User user);
    @Mapping(target = "isOnboardingCompleted", expression = "java(user.checkOnboardingStatus())")
    BasicInfoResponse userToBasicInfoResponse(User user);
}
