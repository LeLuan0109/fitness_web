import { likeComment, unlikeComment } from "@/api/comment.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { ForumComment } from "@/types/forum.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

type ToggleLikeCommentParams = {
  commentId: string
  postId: string
  isLiked: boolean
}

export const useToggleLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<ForumComment>, AxiosError<ResponseError>, ToggleLikeCommentParams>({
    mutationFn: ({ commentId, isLiked }: ToggleLikeCommentParams) => {
      return isLiked ? unlikeComment(commentId) : likeComment(commentId)
    },
    onSuccess: (_, variables) => {
      // Invalidate comments list to refresh like count
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.COMMENTS, variables.postId] })
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || "Có lỗi xảy ra"
      toast.error(errorMessage)
    },
  })
}
