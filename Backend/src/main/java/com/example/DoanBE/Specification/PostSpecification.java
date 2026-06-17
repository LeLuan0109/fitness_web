package com.example.DoanBE.Specification;

import com.example.DoanBE.Model.Post;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class PostSpecification {

    public static Specification<Post> notDeleted() {
        return (root, query, cb) ->
                cb.isFalse(root.get("isDeleted"));
    }

    public static Specification<Post> createdAfter(LocalDateTime fromDate) {
        return (root, query, cb) ->
                fromDate == null ? null : cb.greaterThanOrEqualTo(
                        root.get("createAt"), fromDate);
    }

    public static Specification<Post> createdBefore(LocalDateTime toDate) {
        return (root, query, cb) ->
                toDate == null ? null : cb.lessThanOrEqualTo(
                        root.get("createAt"), toDate);
    }

    public static Specification<Post> keyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return null;
            }

            String like = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(root.get("content")), like)
            );
        };
    }

    public static Specification<Post> owner(Long ownerId) {
        return (root, query, cb) ->
                ownerId == null ? null : cb.equal(
                        root.get("user").get("id"), ownerId);
    }

    public static Specification<Post> byPostId(Long postId) {
        return (root, query, cb) ->
                postId == null ? null :
                        cb.equal(root.get("id"), postId);
    }

    public static Specification<Post> fetchUser() {
        return (root, query, cb) -> {
            if (Post.class.equals(query.getResultType())) {
                root.fetch("user", JoinType.INNER);
                query.distinct(true);
            }
            return null;
        };
    }
}

