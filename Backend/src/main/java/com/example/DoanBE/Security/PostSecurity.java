package com.example.DoanBE.Security;

import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Model.Comments;
import com.example.DoanBE.Model.Post;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("postSecurity")
@RequiredArgsConstructor
public class PostSecurity {

    private final PostRepository postRepository;

    public boolean canUpdate(Long postId, Authentication authentication) throws DataNotFoundException {
        User currentUser = (User) authentication.getPrincipal();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new DataNotFoundException(
                        "Post not found"));

        return post.getUser().getId().equals(currentUser.getId());
    }

    public boolean canDelete(Long postId, Authentication authentication) throws DataNotFoundException {

        User currentUser = (User) authentication.getPrincipal();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new DataNotFoundException(
                        "Post not found"));

        boolean isPostOwner =
                post.getUser().getId().equals(currentUser.getId());

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return isPostOwner || isAdmin;
    }

}
