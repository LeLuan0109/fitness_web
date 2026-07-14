package com.example.Fitness.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class PostLikeCK implements Serializable {

    @Column(nullable = false, name = "post_id")
    private Long postId;

    @Column(nullable = false, name = "user_id")
    private Long userId;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof PostLikeCK postLikeCK)) {
            return false;
        }
        return this.userId.equals(postLikeCK.userId) && this.postId.equals(postLikeCK.postId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, postId);
    }
}
