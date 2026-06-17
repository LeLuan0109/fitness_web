package com.example.DoanBE.Controller;

import com.example.DoanBE.Constants.FolderConstants;
import com.example.DoanBE.DTO.criteria.PostCriteria;
import com.example.DoanBE.DTO.request.ChangePasswordRequest;
import com.example.DoanBE.DTO.request.OnboardingRequest;
import com.example.DoanBE.DTO.request.UpdateProfileRequest;
import com.example.DoanBE.DTO.response.common.ApiResponse;
import com.example.DoanBE.DTO.response.common.Pagination;
import com.example.DoanBE.DTO.response.community.PostResponse;
import com.example.DoanBE.DTO.response.errors.ErrorResponse;
import com.example.DoanBE.DTO.response.errors.TError;
import com.example.DoanBE.DTO.response.user.ProfileResponse;
import com.example.DoanBE.DTO.response.user.UserResponse;
import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Service.FileUploadService;
import com.example.DoanBE.Service.PostService;
import com.example.DoanBE.Service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/user")
@Tag(name = "User controller")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final FileUploadService fileUploadService;
    private final PostService postService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsersList(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by("id").descending());

        Page<UserResponse> userPage = userService.getAllUsers(keyword, pageable);

        Pagination pageMeta = Pagination.builder()
                .page(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalPages(userPage.getTotalPages())
                .total(userPage.getTotalElements())
                .hasMore(userPage.hasNext())
                .build();

        List<UserResponse> userResponseList = userPage.getContent();
        return ResponseEntity.ok(ApiResponse.builder()
                .status(true)
                .data(userResponseList)
                .meta(pageMeta)
                .build());
    }

    @PutMapping("/onboarding")
    public ResponseEntity<?> updateOnboarding(@Valid @RequestBody OnboardingRequest onboardingRequest) {
        try {
            UserResponse updatedUser = userService.updateOnboardingInfo(onboardingRequest);

            return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                    .status(true)
                    .data(updatedUser)
                    .build());
        } catch (Exception e) {
            TError error = TError.builder().code("BAD_REQUEST").message(e.getMessage()).build();
            return ResponseEntity.badRequest().body(ErrorResponse.builder()
                    .error(error)
                    .build());
        }
    }

    @Operation(summary = "Lấy danh sách bài viết của người dùng",
            description = "Lấy danh sách bài viết của người dùng theo key, " +
                    "page (default value = 0), limit (default value = 10), " +
                    "order (default value = desc), orderAttribute (default value = createdAt). " +
                    "Example url: /api/user/posts?key=\"key\"&page=0&limit=10&order=asc" +
                    "&startDate=13/12/2025&endDate=13/12/2025")
    @GetMapping("/posts")
    public ResponseEntity<?> getMyPosts(
            @Valid PostCriteria postCriteria
    ) {

        Page<PostResponse> postPage = postService.getMyPosts(postCriteria);

        Pagination pageMeta = Pagination.builder()
                .page(postPage.getNumber())
                .pageSize(postPage.getSize())
                .totalPages(postPage.getTotalPages())
                .total(postPage.getTotalElements())
                .hasMore(postPage.hasNext())
                .build();

        List<PostResponse> postResponseList = postPage.getContent();

        return ResponseEntity.ok(ApiResponse.builder()
                .status(true)
                .data(postResponseList)
                .meta(pageMeta)
                .build());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile(Authentication authentication) throws DataNotFoundException {
        ProfileResponse profile = userService.getMyProfile();
        return ResponseEntity.ok(ApiResponse.<ProfileResponse>builder()
                .status(true)
                .data(profile)
                .build());
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMyProfile(
            @Valid @ModelAttribute UpdateProfileRequest request,
            @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile,
            Authentication authentication) {

        String username = authentication.getName();
        try {
            if (avatarFile != null && !avatarFile.isEmpty()) {
                User currentUser = userService.getUserByUsername(username);
                String oldAvatarUrl = currentUser.getAvatar();
                if (oldAvatarUrl != null && oldAvatarUrl.contains("cloudinary.com")) {
                    String publicId = fileUploadService.getPublicIdFromUrl(oldAvatarUrl);
                    try {
                        fileUploadService.deleteFile(publicId);
                    } catch (Exception ex) {
                        System.err.println("Không thể xóa ảnh cũ: " + ex.getMessage());
                    }
                }
                String avatarUrl = fileUploadService.uploadImage(avatarFile, FolderConstants.USERS);
                request.setAvatar(avatarUrl);
            }
            userService.updateUserProfile(username, request);
            return ResponseEntity.ok(ApiResponse.builder().status(true).data(true).build());
        } catch (RuntimeException | IOException e ) {
            TError tError = TError.builder().code("ERROR").message(e.getMessage()).build();
            ErrorResponse errorResponse = ErrorResponse.builder().error(tError).build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.builder().status(true).data("Đổi mật khẩu thành công!").build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')") // Chỉ Admin mới được gọi
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long id,
            @RequestParam boolean isLocked
    ) throws DataNotFoundException {
            userService.updateUserStatus(id, isLocked);

            String message = isLocked ? "Đã khóa tài khoản thành công!" : "Đã mở khóa tài khoản thành công!";

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .status(true)
                    .data(message)
                    .build());

    }
}