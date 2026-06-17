import { createPost } from "@/api/forum.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { CreatePostRequest } from "@/types/forum.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<number>, AxiosError<ResponseError>, CreatePostRequest>({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: () => {
      toast.success("Tạo bài viết thành công")
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POSTS] })
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || "Tạo bài viết thất bại"
      toast.error(errorMessage)
    },
  })
}
