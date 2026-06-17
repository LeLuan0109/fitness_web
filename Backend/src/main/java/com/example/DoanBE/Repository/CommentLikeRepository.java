package com.example.DoanBE.Repository;

import com.example.DoanBE.Model.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    CommentLike findByCommentIdAndUserId(Long commentId, Long userId);

    Boolean existsByCommentIdAndUserId(Long commentId, Long userId);



    @Query("""
    SELECT cl.comment.id
    FROM CommentLike cl
    WHERE cl.user.id = :userId
      AND cl.comment.id IN :commentIds
    """)
    Set<Long> findLikedCommentIds(
            @Param("userId") Long userId,
            @Param("commentIds") List<Long> commentIds
    );

    @Query("""
    SELECT cl.comment.id, COUNT(cl)
    FROM CommentLike cl
    WHERE cl.comment.id IN :commentIds
    GROUP BY cl.comment.id
    """)
    List<Object[]> countByCommentIds(
            @Param("commentIds") List<Long> commentIds
    );
}


