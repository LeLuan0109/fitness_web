import { getComments } from "@/api/forum.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Pagination, Response, ResponseError } from "@/types/common.type"
import { ForumComment } from "@/types/forum.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

type CommentsQueryResult = {
  comments: ForumComment[]
  pagination?: Pagination
}

type CommentsParams = {
  page?: number
  limit?: number
  order?: "ASC" | "DESC"
}

export const useGetComments = (postId?: string, params?: CommentsParams) => {
  return useQuery<Response<ForumComment[]>, AxiosError<ResponseError>, CommentsQueryResult>({
    queryKey: [QUERY_KEYS.FORUM.COMMENTS, postId, params],
    queryFn: () =>
      getComments(postId!, {
        page: params?.page,
        limit: params?.limit,
        order: params?.order,
      }),
    enabled: !!postId,
    select: (data) => ({
      comments:
        data.data?.map((comment) => ({
          ...comment,
          // Map new API fields to old structure for backward compatibility
          author: {
            id: comment.userId,
            name: comment?.userName,
            avatar: comment?.userAvatarUrl || "",
          },
        })) ?? [],
      pagination: data.meta,
    }),
  })
}
