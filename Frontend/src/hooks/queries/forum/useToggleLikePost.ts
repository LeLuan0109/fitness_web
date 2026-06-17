import { likePost, unlikePost } from "@/api/forum.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { ForumPost } from "@/types/forum.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

type ToggleLikeParams = {
  postId: string
  isLiked: boolean
}

export const useToggleLikePost = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<ForumPost>, AxiosError<ResponseError>, ToggleLikeParams>({
    mutationFn: ({ postId, isLiked }: ToggleLikeParams) => {
      return isLiked ? unlikePost(postId) : likePost(postId)
    },
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POSTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POST_DETAIL] })
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || "Có lỗi xảy ra khi thao tác"
      toast.error(errorMessage)
    },
  })
}
