package com.example.Fitness.Repository;

import com.example.Fitness.Model.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentsRepository extends JpaRepository<Comments, Long>, JpaSpecificationExecutor<Comments> {

    List<Comments> findByPostIdAndIsDeleted(Long postId, boolean isDeleted);

    Optional<Comments> findByIdAndIsDeleted(Long commentId, boolean isDeleted);

    @Query("""
    SELECT c.post.id, COUNT(c)
    FROM Comments c
    WHERE c.post.id IN :postIds
    AND c.isDeleted = false
    GROUP BY c.post.id
    """)
    List<Object[]> countByPostIdsRaw(@Param("postIds") List<Long> postIds);


}
