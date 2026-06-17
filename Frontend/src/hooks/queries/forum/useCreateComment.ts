import { createComment, CreateCommentRequest } from "@/api/comment.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { ForumComment } from "@/types/forum.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<ForumComment>, AxiosError<ResponseError>, CreateCommentRequest>({
    mutationFn: (data: CreateCommentRequest) => createComment(data),
    onSuccess: (_, variables) => {
      // Invalidate comments list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.COMMENTS, variables.postId] })
      // Invalidate post detail to update comment count
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POST_DETAIL, variables.postId] })
      // Invalidate posts list to update comment count in feed
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POSTS] })
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || "Thêm bình luận thất bại"
      toast.error(errorMessage)
    },
  })
}
