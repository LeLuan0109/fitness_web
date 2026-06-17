package com.example.DoanBE.Specification;

import com.example.DoanBE.Model.Comments;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class CommentSpecification {

    public static Specification<Comments> notDeleted() {
        return (root, query, cb) ->
                cb.isFalse(root.get("isDeleted"));
    }

    public static Specification<Comments> byPost(Long postId) {
        return (root, query, cb) ->
                postId == null ? null :
                        cb.equal(root.get("post").get("id"), postId);
    }

    public static Specification<Comments> byCommentId(Long commentId) {
        return (root, query, cb) ->
                commentId == null ? null :
                        cb.equal(root.get("id"), commentId);
    }

    public static Specification<Comments> fetchUser() {
        return (root, query, cb) -> {
            // Only fetch if it's not a count query
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("user", JoinType.INNER);
                query.distinct(true);
            }
            return null;
        };
    }
}