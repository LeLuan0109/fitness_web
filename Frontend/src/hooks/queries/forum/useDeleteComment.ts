import { deleteComment } from "@/api/comment.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

type DeleteCommentParams = {
  id: string
  postId: string
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<void>, AxiosError<ResponseError>, DeleteCommentParams>({
    mutationFn: ({ id }: DeleteCommentParams) => deleteComment(id),
    onSuccess: (_, variables) => {
      toast.success("Xóa bình luận thành công")
      // Invalidate comments list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.COMMENTS, variables.postId] })
      // Invalidate post detail to update comment count
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POST_DETAIL, variables.postId] })
      // Invalidate posts list to update comment count in feed
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POSTS] })
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || "Xóa bình luận thất bại"
      toast.error(errorMessage)
    },
  })
}
