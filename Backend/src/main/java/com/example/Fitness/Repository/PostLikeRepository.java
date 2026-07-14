package com.example.Fitness.Repository;

import com.example.Fitness.Model.PostLike;
import com.example.Fitness.Model.PostLikeCK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, PostLikeCK> {

    @Query("""
    SELECT pl.id.postId
    FROM PostLike pl
    WHERE pl.id.userId = :userId
      AND pl.id.postId IN :postIds
    """)
    Set<Long> findLikedPostIds(
            @Param("userId") Long userId,
            @Param("postIds") List<Long> postIds
    );


    @Query("""
    SELECT pl.id.postId, COUNT(pl)
    FROM PostLike pl
    WHERE pl.id.postId IN :postIds
    GROUP BY pl.id.postId
    """)
    List<Object[]> countByPostIdsRaw(
            @Param("postIds") List<Long> postIds
    );



}
