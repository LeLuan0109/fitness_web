import { updatePost } from "@/api/forum.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { CreatePostRequest } from "@/types/forum.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

type UpdatePostParams = {
  id: string
  data: CreatePostRequest
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<void>, AxiosError<ResponseError>, UpdatePostParams>({
    mutationFn: ({ id, data }: UpdatePostParams) => updatePost(id, data),
    onSuccess: (_, variables) => {
      toast.success("Cập nhật bài viết thành công")
      // Invalidate posts list and specific post detail
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POSTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POST_DETAIL, variables.id] })
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || "Cập nhật bài viết thất bại"
      toast.error(errorMessage)
    },
  })
}
