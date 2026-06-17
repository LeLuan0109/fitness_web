import { getPostDetail } from "@/api/forum.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { PostDetail } from "@/types/forum.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetPostDetail = (id?: string) => {
  return useQuery<Response<PostDetail>, AxiosError<ResponseError>, PostDetail | null>({
    queryKey: [QUERY_KEYS.FORUM.POST_DETAIL, id],
    queryFn: () => getPostDetail(id!),
    enabled: !!id,
    select: (data) => {
      const post = data.data
      if (!post) return null

      return {
        ...post,
        author: post.author || {
          id: post.userId,
          name: post.userName,
          avatar: post.userAvatarUrl || "",
        },
        likes: post.likes ?? post.likeCount,
        isLiked: post.isLiked ?? post.liked,
        comments: post.comments ?? [],
        createdAt: post.createdAt ?? post.createAt,
      }
    },
  })
}
