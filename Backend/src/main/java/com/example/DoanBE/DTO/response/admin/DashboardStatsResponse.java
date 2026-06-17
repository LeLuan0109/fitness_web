package com.example.DoanBE.DTO.response.admin;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class DashboardStatsResponse {
    private Long totalActivateUsers;
    private Long newUsersToday;
    private Long totalSystemMenus;
    private Long totalSystemPlans;
}
