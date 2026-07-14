package com.example.Fitness.Mapper;

import com.example.Fitness.DTO.response.role.RoleResponse;
import com.example.Fitness.Model.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleResponse roleToRoleResponse(Role role);
}
