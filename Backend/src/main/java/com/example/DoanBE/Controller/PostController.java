package com.example.DoanBE.Controller;


import com.example.DoanBE.DTO.criteria.BaseCriteria;
import com.example.DoanBE.DTO.criteria.PostCriteria;
import com.example.DoanBE.DTO.request.PostRequest;
import com.example.DoanBE.DTO.response.common.ApiResponse;
import com.example.DoanBE.DTO.response.common.Pagination;
import com.example.DoanBE.DTO.response.community.CommentResponse;
import com.example.DoanBE.DTO.response.community.PostResponse;
import com.example.DoanBE.Service.CommentService;
import com.example.DoanBE.Service.PostLikeService;
import com.example.DoanBE.Service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Post controller", description = "Api relate to post")
@RestController
@RequestMapping("${api.prefix}/posts")
@RequiredArgsConstructor
public class PostController {


    private final PostService postService;
    private final PostLikeService postLikeService;
    private final CommentService commentService;

    @Operation(summary = "Lấy danh sách bài viết",
            description = "Lấy danh sách bài viết theo key, page (default value = 0), limit (default value = 10), " +
                    "order (default value = desc), orderAttribute (default value = createdAt). " +
                    "Example url: /api/posts?key=\"key\"&page=0&limit=10&order=asc" +
                    "&startDate=13/12/2025&endDate=13/12/2025")
    @GetMapping
    public ResponseEntity<?> getPosts(
            @Valid PostCriteria postCriteria
    ) {

        Page<PostResponse> result = postService.getPosts(postCriteria);
        Pagination pageMeta = Pagination.builder()
                .page(result.getNumber())
                .pageSize(result.getSize())
                .totalPages(result.getTotalPages())
                .total(result.getTotalElements())
                .hasMore(result.hasNext())
                .build();
        List<PostResponse> postResponses = result.getContent();
        return ResponseEntity.ok(ApiResponse.<List<PostResponse>>builder().status(true).data(postResponses).meta(pageMeta).build());

    }

    @Operation(summary = "Lấy 1 bài viết",
            description = "Lấy 1 bài viết có postId=id")
    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailPost(@PathVariable("id") Long id) {

        PostResponse postResponse = postService.getDetailPost(id);
        return ResponseEntity.ok(ApiResponse.<PostResponse>builder().status(true).data(postResponse).build());

    }

    @Operation(summary = "Lấy danh sách bình luận",
            description = "Lấy danh sách bình luận thuộc về bài viết có postId = id theo page (default value = 0), limit (default value = 10), " +
                    "order (default value = desc), orderAttribute (default value = createdAt). " +
                    "Example url: /api/posts/1/comments?page=0&limit=10&order=asc")
    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getCommentsBelongToPost(
            @PathVariable("id") Long postId,
            @Valid BaseCriteria baseCriteria
    ) {


        Page<CommentResponse> result = commentService.getComments(postId, baseCriteria);
        Pagination pageMeta = Pagination.builder()
                .page(result.getNumber())
                .pageSize(result.getSize())
                .totalPages(result.getTotalPages())
                .total(result.getTotalElements())
                .hasMore(result.hasNext())
                .build();
        List<CommentResponse> commentResponses = result.getContent();
        return ResponseEntity.ok(ApiResponse.<List<CommentResponse>>builder()
                .status(true)
                .data(commentResponses)
                .meta(pageMeta)
                .build());

    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(@ModelAttribute PostRequest request) {
        try {
            PostResponse postResponse = postService.createPost(request);

            return ResponseEntity.ok(ApiResponse.<PostResponse>builder()
                    .status(true)
                    .data(postResponse)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("@postSecurity.canUpdate(#id, authentication)")
    public ResponseEntity<?> updatePost(
            @PathVariable(value = "id") Long id,
            @ModelAttribute PostRequest request) {
        try {
            PostResponse postResponse = postService.updatePost(id, request);

            return ResponseEntity.ok(ApiResponse.<PostResponse>builder()
                    .status(true)
                    .data(postResponse)
                    .build());
        } catch (Exception  e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@postSecurity.canDelete(#id, authentication)")
    public ResponseEntity<?> deletePost(@PathVariable("id") Long id) {

        postService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .status(true)
                .data("Xóa thành công bài viết có ID: " + id)
                .build());

    }

    @PostMapping("/{postId}/post-like")
    public ResponseEntity<?> addPostLike(
            @PathVariable("postId") Long postId
    ) {


        PostResponse postResponse = postLikeService.addPostLike(postId);
        return ResponseEntity.ok(ApiResponse.<PostResponse>builder()
                .status(true)
                .data(postResponse)
                .build());

    }

    @DeleteMapping("/{postId}/post-like")
    public ResponseEntity<?> deletePostLike(
            @PathVariable("postId") Long postId
    ) {

        PostResponse postResponse = postLikeService.deletePostLike(postId);
        return ResponseEntity.ok(ApiResponse.<PostResponse>builder()
                .status(true)
                .data(postResponse)
                .build());

    }



}
