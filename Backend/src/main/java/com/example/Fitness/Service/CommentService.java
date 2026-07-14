package com.example.Fitness.Service;

import com.example.Fitness.Constants.FolderConstants;
import com.example.Fitness.DTO.criteria.BaseCriteria;
import com.example.Fitness.DTO.request.CommentRequest;
import com.example.Fitness.DTO.response.community.CommentResponse;
import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Mapper.CommentMapper;
import com.example.Fitness.Model.BaseEntity;
import com.example.Fitness.Model.Comments;
import com.example.Fitness.Model.Post;
import com.example.Fitness.Model.User;
import com.example.Fitness.Repository.CommentLikeRepository;
import com.example.Fitness.Repository.CommentsRepository;
import com.example.Fitness.Repository.PostRepository;
import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Specification.CommentSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CommentService {

    private final CommentsRepository commentsRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final PostRepository postRepository;
    private final FileUploadService cloudinaryService;
    private final CommentMapper commentMapper;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public Page<CommentResponse> getComments(Long postId, BaseCriteria baseCriteria) throws DataNotFoundException {
        Sort sort = Sort.by(BaseEntity.CREATED_AT_ORDER).descending();
        sort = baseCriteria.getOrder().equalsIgnoreCase(BaseCriteria.ASC_ORDER)
                ? sort.ascending()
                : sort.descending();

        Pageable pageable = PageRequest.of(
                baseCriteria.getPage(),
                baseCriteria.getSize(),
                sort
        );

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Specification<Comments> spec =
                (CommentSpecification.notDeleted())
                        .and(CommentSpecification.byPost(postId))
                        .and(CommentSpecification.fetchUser());

        Page<Comments> comments = commentsRepository.findAll(spec, pageable);

        boolean isAdmin = currentUser.getRole()
                .getName()
                .equalsIgnoreCase("ADMIN");


        List<Long> commentIds = comments.stream()
                .map(Comments::getId)
                .toList();

        Set<Long> likedIds =
                commentLikeRepository.findLikedCommentIds(currentUser.getId(), commentIds);

        Map<Long, Long> likeCounts =
                commentLikeRepository.countByCommentIds(commentIds)
                        .stream()
                        .collect(Collectors.toMap(
                                row -> (Long) row[0],
                                row -> ((Number) row[1]).longValue()
                        ));

        Long postOwnerId = postRepository.findById(postId)
                .map(p -> p.getUser().getId())
                .orElse(null);

        boolean isOwnerPost =
                postOwnerId != null &&
                        postOwnerId.equals(currentUser.getId());


        return comments.map(comment -> {
            CommentResponse dto = commentMapper.toResponse(comment);

            dto.setLikeCount(likeCounts.getOrDefault(comment.getId(), 0L));
            dto.setLiked(likedIds.contains(comment.getId()));
            boolean isOwner = comment.getUser().getId().equals(currentUser.getId());
            dto.setCanEdit(isOwner);
            dto.setCanDelete(isAdmin || isOwner || isOwnerPost);

            return dto;
        });
    }

    public CommentResponse getDetailComment(Long commentId) throws DataNotFoundException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        Specification<Comments> spec =
                (CommentSpecification.notDeleted())
                        .and(CommentSpecification.byCommentId(commentId))
                        .and(CommentSpecification.fetchUser());

        Comments comment = commentsRepository.findOne(spec)
                .orElseThrow(
                        () -> new DataNotFoundException(
                                "Không tìm thấy bình luận với ID: "
                                        + commentId)
                );


        boolean isAdmin = currentUser.getRole()
                .getName()
                .equalsIgnoreCase("ADMIN");

        boolean isOwner = comment.getUser().getId().equals(currentUser.getId());
        boolean isOwnerPost = comment.getPost().getUser().getId().equals(currentUser.getId());

        CommentResponse dto = commentMapper.toResponse(comment);

        dto.setLikeCount(
                commentLikeRepository.countByCommentIds(
                                List.of(comment.getId()))
                        .stream()
                        .collect(Collectors.toMap(
                                row -> (Long) row[0],
                                row -> ((Number) row[1]).longValue()
                        )).getOrDefault(comment.getId(), 0L)
        );

        dto.setLiked(
                commentLikeRepository.findLikedCommentIds(
                        currentUser.getId(), List.of(comment.getId())
                ).contains(comment.getId())
        );

        dto.setCanEdit(isOwner);
        dto.setCanDelete(isAdmin || isOwner || isOwnerPost);

        return dto;

    }

    public CommentResponse createComment(CommentRequest request) throws DataNotFoundException, IOException {
        Post post = postRepository.findByIdAndIsDeleted(request.getPostId(), false)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bài viết với ID: " + request.getPostId()));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Comments comment = new Comments();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setUser(currentUser);

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            comment.setImage(cloudinaryService.uploadImage(request.getImage(), FolderConstants.COMMUNITY));
        }
        Comments newComment = commentsRepository.save(comment);

        // Send notification to post owner (if not commenting on own post)
        if (!post.getUser().getId().equals(currentUser.getId())) {
            try {
                String title = "Bình luận mới";
                String userName = (currentUser.getName() != null && !currentUser.getName().isEmpty())
                        ? currentUser.getName()
                        : "Ai đó";
                String message = userName + " đã bình luận vào bài viết của bạn";
                notificationService.createAndSendNotification(
                        post.getUser().getId(),
                        title,
                        message,
                        "SOCIAL",
                        newComment.getId(),
                        "/posts/" + post.getId()
                );
                log.debug("Comment notification sent to user {}", post.getUser().getId());
            } catch (Exception e) {
                // Don't fail the comment operation if notification fails
                log.error("Failed to send comment notification: {}", e.getMessage());
            }
        }

        return getDetailComment(newComment.getId());

    }

    public CommentResponse updateComment(Long commentId, CommentRequest request) throws DataNotFoundException, IOException, AccessDeniedException {
        Comments comment = commentsRepository.findByIdAndIsDeleted(commentId, false)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bình luận với ID: " + commentId));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        boolean isCommentOwner =
                comment.getUser().getId().equals(currentUser.getId());

        if (!isCommentOwner) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa bình luận này");
        }

        if (request.getContent() != null) {
            comment.setContent(request.getContent());
        }

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            if (comment.getImage() != null) {
                cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(comment.getImage()));
            }
            comment.setImage(cloudinaryService.uploadImage(request.getImage(), FolderConstants.COMMUNITY));
        } else if (request.isDeleteImage()) {
            if (comment.getImage() != null) {
                try {
                    cloudinaryService.deleteFile(cloudinaryService.getPublicIdFromUrl(comment.getImage()));
                    comment.setImage(null);
                } catch (IOException e) {

                }
            }
        }

        commentsRepository.save(comment);
        return getDetailComment(commentId);
    }

    public void deleteComment(Long commentId) throws DataNotFoundException, AccessDeniedException {
        Comments comment = commentsRepository.findByIdAndIsDeleted(commentId, false)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bình luận với ID: " + commentId));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        boolean isCommentOwner =
                comment.getUser().getId().equals(currentUser.getId());

        boolean isPostOwner =
                comment.getPost().getUser().getId().equals(currentUser.getId());

        boolean isAdmin = currentUser.getRole()
                .getName()
                .equalsIgnoreCase("ADMIN");


        if (!isCommentOwner && !isPostOwner && !isAdmin ) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa bình luận ");
        }

        comment.setDeleted(true);
        commentsRepository.save(comment);

    }


}
