package com.example.DoanBE.Service;

import com.example.DoanBE.Constants.FolderConstants;
import com.example.DoanBE.DTO.criteria.BaseCriteria;
import com.example.DoanBE.DTO.criteria.PostCriteria;
import com.example.DoanBE.DTO.request.PostRequest;
import com.example.DoanBE.DTO.response.community.PostResponse;
import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Mapper.PostMapper;
import com.example.DoanBE.Model.BaseEntity;
import com.example.DoanBE.Model.Comments;
import com.example.DoanBE.Model.Post;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Repository.CommentsRepository;
import com.example.DoanBE.Repository.PostLikeRepository;
import com.example.DoanBE.Repository.PostRepository;
import com.example.DoanBE.Specification.PostSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentsRepository commentsRepository;
    private final PostLikeRepository postLikeRepository;
    private final FileUploadService cloudinaryService;
    private final PostMapper postMapper;

    @Transactional(readOnly = true)
    public Page<PostResponse> getMyPosts(PostCriteria postCriteria) {
        Sort sort = Sort.by(BaseEntity.CREATED_AT_ORDER).descending();
        sort = postCriteria.getOrder().equalsIgnoreCase(BaseCriteria.ASC_ORDER)
                ? sort.ascending()
                : sort.descending();

        Pageable pageable = PageRequest.of(
                postCriteria.getPage(),
                postCriteria.getSize(),
                sort
        );

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        boolean isAdmin = currentUser.getRole()
                .getName()
                .equalsIgnoreCase("ADMIN");

        // Build specification with user filter
        Specification<Post> spec = PostSpecification.notDeleted()
                .and(PostSpecification.owner(currentUser.getId())); // Filter by current user!

        if (postCriteria.getStartDate() != null) {
            spec = spec.and(PostSpecification.createdAfter(
                    LocalDateTime.of(postCriteria.getStartDate(), LocalTime.MIN))
            );
        }
        if (postCriteria.getEndDate() != null) {
            spec = spec.and(PostSpecification.createdBefore(
                    LocalDateTime.of(postCriteria.getEndDate(), LocalTime.MAX))
            );
        }
        spec = spec.and(PostSpecification.keyword(postCriteria.getKey()))
                .and(PostSpecification.fetchUser());

        Page<Post> posts = postRepository.findAll(spec, pageable);


        List<Long> postIds = posts.stream()
                .map(Post::getId)
                .toList();

        Map<Long, Long> likeCountMap =
                postLikeRepository.countByPostIdsRaw(postIds)
                        .stream()
                        .collect(Collectors.toMap(
                                row -> (Long) row[0],
                                row -> (Long) row[1]
                        ));

        Map<Long, Long> commentCounts =
                commentsRepository.countByPostIdsRaw(postIds)
                        .stream()
                        .collect(Collectors.toMap(
                                row -> (Long) row[0],
                                row -> ((Number) row[1]).longValue()
                        ));
        Set<Long> likedPostIds =
                postLikeRepository.findLikedPostIds(currentUser.getId(), postIds);

        return posts.map(post -> {
            PostResponse dto = postMapper.toResponse(post);

            dto.setLikeCount(likeCountMap.getOrDefault(post.getId(), 0L));
            dto.setCommentCount(commentCounts.getOrDefault(post.getId(), 0L));
            dto.setLiked(likedPostIds.contains(post.getId()));
            boolean isOwner = post.getUser().getId().equals(currentUser.getId());
            dto.setCanDelete(isAdmin || isOwner);
            dto.setCanEdit(isOwner);
            return dto;
        });


    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getPosts(PostCriteria postCriteria) throws DataNotFoundException {
        Sort sort = Sort.by(BaseEntity.CREATED_AT_ORDER).descending();
        sort = postCriteria.getOrder().equalsIgnoreCase(BaseCriteria.ASC_ORDER)
                ? sort.ascending()
                : sort.descending();

        Pageable pageable = PageRequest.of(
                postCriteria.getPage(),
                postCriteria.getSize(),
                sort
        );

        Specification<Post> spec =
                PostSpecification.notDeleted();
        if (postCriteria.getStartDate() != null) {
            spec = spec.and(PostSpecification.createdAfter(
                    LocalDateTime.of(postCriteria.getStartDate(), LocalTime.MIN))
            );
        }
        if (postCriteria.getEndDate() != null) {
            spec = spec.and(PostSpecification.createdBefore(
                    LocalDateTime.of(postCriteria.getEndDate(), LocalTime.MAX))
            );
        }
        spec = spec.and(PostSpecification.keyword(postCriteria.getKey()))
                .and(PostSpecification.fetchUser());

        Page<Post> posts = postRepository.findAll(spec, pageable);


        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        boolean isAdmin = currentUser.getRole()
                .getName()
                .equalsIgnoreCase("ADMIN");

        List<Long> postIds = posts.stream()
                .map(Post::getId)
                .toList();

        Map<Long, Long> likeCountMap =
                postLikeRepository.countByPostIdsRaw(postIds)
                        .stream()
                        .collect(Collectors.toMap(
                                row -> (Long) row[0],
                                row -> (Long) row[1]
                        ));

        Map<Long, Long> commentCounts =
                commentsRepository.countByPostIdsRaw(postIds)
                        .stream()
                        .collect(Collectors.toMap(
                                row -> (Long) row[0],
                                row -> ((Number) row[1]).longValue()
                        ));

        Set<Long> likedPostIds =
                postLikeRepository.findLikedPostIds(currentUser.getId(), postIds);

        return posts.map(post -> {
            PostResponse dto = postMapper.toResponse(post);

            dto.setLikeCount(likeCountMap.getOrDefault(post.getId(), 0L));
            dto.setCommentCount(commentCounts.getOrDefault(post.getId(), 0L));
            dto.setLiked(likedPostIds.contains(post.getId()));
            boolean isOwner = post.getUser().getId().equals(currentUser.getId());
            dto.setCanDelete(isAdmin || isOwner);
            dto.setCanEdit(isOwner);

            return dto;
        });


    }

    public PostResponse getDetailPost(Long id) throws DataNotFoundException {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Specification<Post> spec = PostSpecification.notDeleted()
                .and(PostSpecification.byPostId(id))
                .and(PostSpecification.fetchUser());

        boolean isAdmin = currentUser.getRole()
                .getName()
                .equalsIgnoreCase("ADMIN");

        Post post = postRepository.findOne(spec)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bài viết với ID: " + id));

        PostResponse dto = postMapper.toResponse(post);

        List<Long> postIds = List.of(id);

        Map<Long, Long> likeCountMap =
                postLikeRepository.countByPostIdsRaw(postIds)
                        .stream()
                        .collect(Collectors.toMap(
                                row -> (Long) row[0],
                                row -> (Long) row[1]
                        ));

        Map<Long, Long> commentCounts =
                commentsRepository.countByPostIdsRaw(postIds)
                        .stream()
                        .collect(Collectors.toMap(
                                row -> (Long) row[0],
                                row -> ((Number) row[1]).longValue()
                        ));

        Set<Long> likedPostIds =
                postLikeRepository.findLikedPostIds(currentUser.getId(), postIds);

        dto.setLikeCount(likeCountMap.getOrDefault(post.getId(), 0L));
        dto.setCommentCount(commentCounts.getOrDefault(post.getId(), 0L));
        dto.setLiked(likedPostIds.contains(post.getId()));
        boolean isOwner = post.getUser().getId().equals(currentUser.getId());
        dto.setCanDelete(isAdmin || isOwner);
        dto.setCanEdit(isOwner);

        return dto;

    }

    @Transactional
    public PostResponse createPost(PostRequest request) throws IOException, DataNotFoundException {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Validate input
        validatePostRequest(request);

        Post post = new Post();
        post.setUser(user);
        post.setTitle(request.getTitle());
        post.setName(request.getName());
        post.setContent(request.getContent());
        try {
            if (request.getImage() != null && !request.getImage().isEmpty()) {
                post.setImage(cloudinaryService.uploadImage(request.getImage(), FolderConstants.COMMUNITY));
            }
            if (request.getVideo() != null && !request.getVideo().isEmpty()) {
                post.setVideo(cloudinaryService.uploadVideo(request.getVideo(), FolderConstants.COMMUNITY));
            }
            Post newPost = postRepository.save(post);
            return getDetailPost(newPost.getId());
        } catch (Exception e) {
            // Rollback will happen automatically due to @Transactional
            // Clean up uploaded files if any
            if (post.getImage() != null) {
                try {
                    cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(post.getImage()));
                } catch (Exception cleanupEx) {
                    // Log but don't fail
                }
            }
            if (post.getVideo() != null) {
                try {
                    cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(post.getVideo()));
                } catch (Exception cleanupEx) {
                    // Log but don't fail
                }
            }
            throw e;
        }
    }

    private void validatePostRequest(PostRequest request) {
        boolean hasMedia = (request.getImage() != null && !request.getImage().isEmpty())
                || (request.getVideo() != null && !request.getVideo().isEmpty());

        if ((request.getContent() == null || request.getContent().trim().isEmpty()) && !hasMedia) {
            throw new RuntimeException("Bài viết phải có nội dung hoặc hình ảnh/video");
        }
        if (request.getContent() != null && request.getContent().length() > 5000) {
            throw new RuntimeException("Nội dung bài viết quá dài (tối đa 5000 ký tự)");
        }
        if (request.getTitle() != null && request.getTitle().length() > 200) {
            throw new RuntimeException("Tiêu đề bài viết quá dài (tối đa 200 ký tự)");
        }
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest request) throws IOException, DataNotFoundException, AccessDeniedException {
        Post post = postRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new DataNotFoundException("Bài viết không tồn tại"));

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa bài viết này");
        }

        // Validate input
        String finalContent = request.getContent() != null ? request.getContent().trim() : post.getContent();
        boolean hasMedia = (request.getImage() != null && !request.getImage().isEmpty())
                || (request.getVideo() != null && !request.getVideo().isEmpty())
                || post.getImage() != null
                || post.getVideo() != null;

        if ((finalContent == null || finalContent.isEmpty()) && !hasMedia) {
            throw new RuntimeException("Bài viết phải có nội dung hoặc hình ảnh/video");
        }

        if (finalContent != null && finalContent.length() > 5000) {
            throw new RuntimeException("Nội dung bài viết quá dài (tối đa 5000 ký tự)");
        }

        String oldImageUrl = post.getImage();
        String oldVideoUrl = post.getVideo();

        try {
            // Update text fields
            if (request.getTitle() != null && !request.getTitle().isBlank()) {
                if (request.getTitle().length() > 200) {
                    throw new RuntimeException("Post title is too long (max 200 characters)");
                }
                post.setTitle(request.getTitle());
            }
            if (request.getName() != null && !request.getName().isBlank()) {
                post.setName(request.getName());
            }
            if (request.getContent() != null && !request.getContent().isBlank()) {
                post.setContent(request.getContent());
            }

            // Update image if provided
            if (request.getImage() != null && !request.getImage().isEmpty()) {
                String newImageUrl = cloudinaryService.uploadImage(request.getImage(), FolderConstants.COMMUNITY);
                post.setImage(newImageUrl);

                // Delete old image after successful upload
                if (oldImageUrl != null) {
                    try {
                        cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(oldImageUrl));
                    } catch (Exception e) {
                        // Log but don't fail the operation
                    }
                }
            } else if (request.isDeleteImage()) {
                if (oldImageUrl != null) {
                    try {
                        cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(oldImageUrl));
                        post.setImage(null);
                    } catch (Exception e) {
                        // Log but don't fail the operation
                    }
                }
            }

            // Update video if provided
            if (request.getVideo() != null && !request.getVideo().isEmpty()) {
                String newVideoUrl = cloudinaryService.uploadVideo(request.getVideo(), FolderConstants.COMMUNITY);
                post.setVideo(newVideoUrl);

                // Delete old video after successful upload
                if (oldVideoUrl != null) {
                    try {
                        cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(oldVideoUrl));
                    } catch (Exception e) {
                        // Log but don't fail the operation
                    }
                }
            } else if (request.isDeleteVideo()) {
                // Delete old video after successful upload
                if (oldVideoUrl != null) {
                    try {
                        cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(oldVideoUrl));
                        post.setVideo(null);
                    } catch (Exception e) {
                        // Log but don't fail the operation
                    }
                }
            }

            postRepository.save(post);
            return getDetailPost(id);
        } catch (Exception e) {
            // If new files were uploaded but save failed, clean them up
            if (request.getImage() != null && !request.getImage().isEmpty() && !post.getImage().equals(oldImageUrl)) {
                try {
                    cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(post.getImage()));
                } catch (Exception cleanupEx) {
                    // Log but don't fail
                }
            }
            if (request.getVideo() != null && !request.getVideo().isEmpty() && !post.getVideo().equals(oldVideoUrl)) {
                try {
                    cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(post.getVideo()));
                } catch (Exception cleanupEx) {
                    // Log but don't fail
                }
            }
            throw e;
        }
    }

    @Transactional
    public void deletePost(Long id) throws DataNotFoundException, AccessDeniedException {
        Post post = postRepository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bài viết với ID: " + id));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();

        boolean isPostOwner =
                post.getUser().getId().equals(currentUser.getId());

        boolean isAdmin = currentUser.getRole()
                .getName()
                .equalsIgnoreCase("ADMIN");

        if (!isPostOwner && !isAdmin) {
            throw new AccessDeniedException("Bạn không có quyền xóa bài viết này");
        }

        // Soft delete all comments
        List<Comments> commentsList = commentsRepository.findByPostIdAndIsDeleted(id, false)
                .stream()
                .peek(comment -> comment.setDeleted(true))
                .toList();
        if (!commentsList.isEmpty()) {
            commentsRepository.saveAll(commentsList);
        }

        // Note: Likes are handled by database constraints or can remain
        // If you want to delete likes, add here:
        // postLikeRepository.deleteByPostId(id);

        // Soft delete the post
        post.setDeleted(true);
        postRepository.save(post);
    }



}
