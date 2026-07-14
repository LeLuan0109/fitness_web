package com.example.Fitness.Security;

import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Model.Comments;
import com.example.Fitness.Model.User;
import com.example.Fitness.Repository.CommentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component("commentSecurity")
@RequiredArgsConstructor
public class CommentSecurity {

    private final CommentsRepository commentRepository;

    public boolean canUpdate(Long commentId, Authentication authentication) throws DataNotFoundException {
        User currentUser = (User) authentication.getPrincipal();

        Comments comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new DataNotFoundException(
                        "Comment not found"));

        return comment.getUser().getId().equals(currentUser.getId());
    }

    public boolean canDelete(Long commentId, Authentication authentication) throws DataNotFoundException {

        User currentUser = (User) authentication.getPrincipal();

        Comments comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new DataNotFoundException(
                        "Comment not found"));

        boolean isCommentOwner =
                comment.getUser().getId().equals(currentUser.getId());

        boolean isPostOwner =
                comment.getPost().getUser().getId().equals(currentUser.getId());

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return isCommentOwner || isPostOwner || isAdmin;
    }
}

