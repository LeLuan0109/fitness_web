import { deletePost } from "@/api/forum.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<void>, AxiosError<ResponseError>, string>({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      toast.success("Xóa bài viết thành công")
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POSTS] })
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || "Xóa bài viết thất bại"
      toast.error(errorMessage)
    },
  })
}
