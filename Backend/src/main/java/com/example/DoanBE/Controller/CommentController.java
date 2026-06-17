package com.example.DoanBE.Controller;

import com.example.DoanBE.DTO.request.CommentRequest;
import com.example.DoanBE.DTO.response.common.ApiResponse;
import com.example.DoanBE.DTO.response.community.CommentResponse;
import com.example.DoanBE.Service.CommentLikeService;
import com.example.DoanBE.Service.CommentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/comments")
@Tag(name = "Comment controller")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final CommentLikeService commentLikeService;


    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailComment(@PathVariable("id") Long id) {
        try {
            CommentResponse commentResponse = commentService.getDetailComment(id);
            return ResponseEntity.ok(ApiResponse.<CommentResponse>builder()
                    .status(true)
                    .data(commentResponse)
                    .build());
        } catch (Exception ex) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse
                            .builder()
                            .status(false)
                            .data(ex.getMessage())
                            .build());
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addComment(@ModelAttribute CommentRequest request) {
        try {
            CommentResponse commentResponse = commentService.createComment(request);
            return ResponseEntity.ok(ApiResponse.<CommentResponse>builder()
                    .status(true)
                    .data(commentResponse)
                    .build());
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse
                            .builder()
                            .status(false)
                            .data(e.getMessage())
                            .build());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("@commentSecurity.canUpdate(#id, authentication)")
    public ResponseEntity<?> updateComment(
            @PathVariable(value = "id") Long id,
            @ModelAttribute CommentRequest request) {
        try {
            CommentResponse commentResponse = commentService.updateComment(id, request);
            return ResponseEntity.ok(ApiResponse.<CommentResponse>builder()
                    .status(true)
                    .data(commentResponse)
                    .build());
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse
                            .builder()
                            .status(false)
                            .data(e.getMessage())
                            .build());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@commentSecurity.canDelete(#id, authentication)")
    public ResponseEntity<?> deleteComment(@PathVariable(value = "id") Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .status(true)
                    .data("Xóa thành công bình luận có ID: " + id)
                    .build());
        } catch (Exception ex) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse
                            .builder()
                            .status(false)
                            .data(ex.getMessage())
                            .build());
        }
    }

    @PostMapping("/{commentId}/comment-like")
    public ResponseEntity<?> addPostLike(
            @PathVariable("commentId") Long commentId
    ) {
        try {

            CommentResponse commentResponse = commentLikeService.addCommentLike(commentId);
            return ResponseEntity.ok(ApiResponse.<CommentResponse>builder()
                    .status(true)
                    .data(commentResponse)
                    .build());
        } catch (Exception ex) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse
                            .builder()
                            .status(false)
                            .data(ex.getMessage())
                            .build());
        }
    }

    @DeleteMapping("/{commentId}/comment-like")
    public ResponseEntity<?> deletePostLike(
            @PathVariable("commentId") Long commentId
    ) {
        try {

            CommentResponse commentResponse = commentLikeService.deleteCommentLike(commentId);
            return ResponseEntity.ok(ApiResponse.<CommentResponse>builder()
                    .status(true)
                    .data(commentResponse)
                    .build());
        } catch (Exception ex) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse
                            .builder()
                            .status(false)
                            .data(ex.getMessage())
                            .build());
        }
    }

}
