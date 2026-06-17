package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.response.community.CommentResponse;
import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Model.CommentLike;
import com.example.DoanBE.Model.Comments;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Repository.CommentLikeRepository;
import com.example.DoanBE.Repository.CommentsRepository;
import com.example.DoanBE.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentLikeService {

    private final CommentLikeRepository commentLikeRepository;
    private final CommentsRepository commentsRepository;
    private final CommentService commentService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public CommentResponse addCommentLike(Long commentId) throws DataNotFoundException {
        // Validate comment exists and is not deleted
        Comments comment = commentsRepository.findByIdAndIsDeleted(commentId, false)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bình luận với ID: " + commentId));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Try to create like with duplicate handling
        try {
            // Check if already exists (within transaction)
            if (commentLikeRepository.existsByCommentIdAndUserId(commentId, user.getId())) {
                log.debug("User {} already liked comment {}", user.getId(), commentId);
                // Already liked - just return current state (idempotent)
                return commentService.getDetailComment(commentId);
            }

            // Create new like
            CommentLike commentLike = new CommentLike();
            commentLike.setUser(user);
            commentLike.setComment(comment);
            commentLikeRepository.save(commentLike);
            commentLikeRepository.flush(); // Force immediate database write

            log.info("User {} liked comment {}", user.getId(), commentId);

            // Send notification to comment owner (if not liking own comment)
            if (!comment.getUser().getId().equals(user.getId())) {
                try {
                    String title = "Lượt thích mới";
                    String userName = (user.getName() != null && !user.getName().isEmpty())
                            ? user.getName()
                            : "Ai đó";
                    String message = userName + " đã thích bình luận của bạn";
                    notificationService.createAndSendNotification(
                            comment.getUser().getId(),
                            title,
                            message,
                            "SOCIAL",
                            comment.getId(),
                            "/posts/" + comment.getPost().getId()
                    );
                    log.debug("Comment like notification sent to user {}", comment.getUser().getId());
                } catch (Exception e) {
                    // Don't fail the like operation if notification fails
                    log.error("Failed to send comment like notification: {}", e.getMessage());
                }
            }

        } catch (DataIntegrityViolationException e) {
            // Handle duplicate key constraint violation (race condition protection)
            log.warn("Duplicate comment like prevented for user {} on comment {}", user.getId(), commentId);
            // Silently handle - user gets same result (idempotent behavior)
        }

        return commentService.getDetailComment(commentId);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public CommentResponse deleteCommentLike(Long commentId) throws DataNotFoundException {
        // Validate comment exists and is not deleted
        Comments comment = commentsRepository.findByIdAndIsDeleted(commentId, false)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bình luận với ID: " + commentId));

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Delete like if exists
        CommentLike commentLike = commentLikeRepository.findByCommentIdAndUserId(comment.getId(), user.getId());
        if (commentLike != null) {
            commentLikeRepository.delete(commentLike);
            commentLikeRepository.flush(); // Force immediate database write
            log.info("User {} unliked comment {}", user.getId(), commentId);
        } else {
            log.debug("User {} attempted to unlike comment {} but like doesn't exist", user.getId(), commentId);
        }
        
        return commentService.getDetailComment(commentId);
    }

}
