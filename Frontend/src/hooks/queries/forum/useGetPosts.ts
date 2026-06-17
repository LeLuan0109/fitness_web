import { getPosts } from "@/api/forum.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Pagination, Response, ResponseError } from "@/types/common.type"
import { ForumPost, PostSearchParams } from "@/types/forum.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

type PostsQueryResult = {
  posts: ForumPost[]
  pagination?: Pagination
}

export const useGetPosts = (params?: PostSearchParams) => {
  return useQuery<Response<ForumPost[]>, AxiosError<ResponseError>, PostsQueryResult>({
    queryKey: [QUERY_KEYS.FORUM.POSTS, params],
    queryFn: () => getPosts(params),
    select: (data) => {
      // Normalize data to match both old and new API format
      const posts = (data.data ?? []).map((post) => ({
        ...post,
        // Map new API fields to old format for backward compatibility
        author: post.author || {
          id: post.userId,
          name: post.userName,
          avatar: post.userAvatarUrl || "",
        },
        likes: post.likes ?? post.likeCount,
        commentsCount: post.commentsCount ?? post.commentCount,
        isLiked: post.isLiked ?? post.liked,
        createdAt: post.createdAt ?? post.createAt,
      }))

      return {
        posts,
        pagination: data.meta,
      }
    },
  })
}
