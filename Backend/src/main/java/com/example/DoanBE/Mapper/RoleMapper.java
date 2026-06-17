package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.response.role.RoleResponse;
import com.example.DoanBE.Model.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleResponse roleToRoleResponse(Role role);
}
