package com.example.Fitness.Repository;

import com.example.Fitness.DTO.response.community.PostResponse;
import com.example.Fitness.Model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {

    Optional<Post> findByIdAndIsDeleted(Long id, boolean isDeleted);

    @Query("""
    SELECT new com.example.Fitness.DTO.response.community.PostResponse(
        p.id,
        p.title,
        p.name,
        p.content,
        p.image,
        p.video,
    
        u.id,
        u.name,
        u.avatar,
    
        (SELECT COUNT(pl)
         FROM PostLike pl
         WHERE pl.post.id = p.id),
    
        (SELECT COUNT(c)
         FROM Comments c
         WHERE c.post.id = p.id
           AND c.isDeleted = false),
    
        CASE WHEN EXISTS (
            SELECT 1
            FROM PostLike pl2
            WHERE pl2.post.id = p.id
              AND pl2.user.id = :userId
        ) THEN true ELSE false END,
    
        CASE WHEN p.user.id = :userId THEN true ELSE false END,
        
        CASE WHEN EXISTS (
            SELECT 1
            FROM User uu
            JOIN uu.role r
            WHERE uu.id = :userId
                AND r.name = 'ADMIN'
        ) THEN true ELSE false END,
    
        p.createAt
    )
    FROM Post p
    JOIN p.user u
    WHERE p.id = :postId
      AND p.isDeleted = false
    """)
    Optional<PostResponse> findByPostIdAndUserId(
            @Param("postId") Long postId,
            @Param("userId") Long userId
    );

}
