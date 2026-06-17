package com.example.DoanBE.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "postlike",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_postlike_user_post",
                columnNames = {"user_id", "post_id"}
        )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostLike extends BaseEntity {

    @EmbeddedId
    private PostLikeCK postLikeCK;

    @MapsId("user_id")
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @MapsId("post_id")
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Post post;


}
