package com.example.DoanBE.DTO.response.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Pagination {
    private int page;
    private int pageSize;
    private int totalPages;
    private long total;
    private boolean hasMore;
}
