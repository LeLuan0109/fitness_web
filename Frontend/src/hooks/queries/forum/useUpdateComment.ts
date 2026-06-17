import { updateComment, UpdateCommentRequest } from "@/api/comment.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { ForumComment } from "@/types/forum.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

type UpdateCommentParams = {
  id: string
  data: UpdateCommentRequest
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<ForumComment>, AxiosError<ResponseError>, UpdateCommentParams>({
    mutationFn: ({ id, data }: UpdateCommentParams) => updateComment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.COMMENTS, variables.data.postId] })
      // Invalidate post detail
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POST_DETAIL, variables.data.postId] })
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POSTS] })
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || "Cập nhật bình luận thất bại"
      toast.error(errorMessage)
    },
  })
}
