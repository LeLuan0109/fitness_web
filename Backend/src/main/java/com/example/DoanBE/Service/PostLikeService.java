package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.response.community.PostResponse;
import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Model.Post;
import com.example.DoanBE.Model.PostLike;
import com.example.DoanBE.Model.PostLikeCK;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Repository.PostLikeRepository;
import com.example.DoanBE.Repository.PostRepository;
import com.example.DoanBE.Repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final PostService postService;
    private final NotificationService notificationService;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public PostResponse addPostLike(Long postId) throws DataNotFoundException {
        // Validate post exists and is not deleted
        Post post = postRepository.findByIdAndIsDeleted(postId, false)
                .orElseThrow(() -> new DataNotFoundException("Bài viết không tồn tại"));

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // IMPORTANT: PostLikeCK constructor is (postId, userId) - match field order!
        PostLikeCK likeId = new PostLikeCK(postId, user.getId());

        // Try to create like with duplicate handling
        try {
            // Check if already exists (within transaction)
            if (postLikeRepository.existsById(likeId)) {
                log.debug("User {} already liked post {}", user.getId(), postId);
                // Already liked - just return current state (idempotent)
                return postService.getDetailPost(postId);
            }

            // Create new like
            PostLike postLike = new PostLike(likeId, user, post);
            postLikeRepository.save(postLike);
            postLikeRepository.flush(); // Force immediate database write

            log.info("User {} liked post {}", user.getId(), postId);

            // Send notification to post owner (if not liking own post)
            if (!post.getUser().getId().equals(user.getId())) {
                try {
                    String title = "Lượt thích mới";
                    String userName = (user.getName() != null && !user.getName().isEmpty())
                            ? user.getName()
                            : "Ai đó";
                    String message = userName + " đã thích bài viết của bạn";
                    notificationService.createAndSendNotification(
                            post.getUser().getId(),
                            title,
                            message,
                            "SOCIAL",
                            post.getId(),
                            "/posts/" + post.getId()
                    );
                    log.debug("Like notification sent to user {}", post.getUser().getId());
                } catch (Exception e) {
                    // Don't fail the like operation if notification fails
                    log.error("Failed to send like notification: {}", e.getMessage());
                }
            }

        } catch (DataIntegrityViolationException e) {
            // Handle duplicate key constraint violation (race condition protection)
            log.warn("Duplicate like attempt prevented for user {} on post {}", user.getId(), postId);
            // Silently handle - user gets same result (idempotent behavior)
        }

        return postService.getDetailPost(postId);
    }


    @Transactional(isolation = Isolation.READ_COMMITTED)
    public PostResponse deletePostLike(Long postId) throws DataNotFoundException {
        // Validate post exists and is not deleted
        Post post = postRepository.findByIdAndIsDeleted(postId, false)
                .orElseThrow(() -> new DataNotFoundException("Bài viết không tồn tại"));

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // IMPORTANT: PostLikeCK constructor is (postId, userId) - match field order!
        PostLikeCK likeId = new PostLikeCK(postId, user.getId());

        // Delete like if exists
        Optional<PostLike> optionalPostLike = postLikeRepository.findById(likeId);
        if (optionalPostLike.isPresent()) {
            postLikeRepository.delete(optionalPostLike.get());
            postLikeRepository.flush(); // Force immediate database write
            log.info("User {} unliked post {}", user.getId(), postId);
        } else {
            log.debug("User {} attempted to unlike post {} but like doesn't exist", user.getId(), postId);
        }

        return postService.getDetailPost(postId);
    }
}
