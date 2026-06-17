import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Response } from "@/types/common.type"
import { CreatePostRequest, ForumComment, ForumPost, PostDetail, PostSearchParams } from "@/types/forum.type"
import { generatePath } from "react-router"

export const getPosts = (params?: PostSearchParams) => {
  return http.get<Response<ForumPost[]>>(API_ENDPOINTS.FORUM.POSTS, { params })
}

export const getMyPosts = (params?: PostSearchParams) => {
  return http.get<Response<ForumPost[]>>(API_ENDPOINTS.FORUM.MY_POSTS, { params })
}

export const getPostDetail = (id: string) => {
  return http.get<Response<PostDetail>>(generatePath(API_ENDPOINTS.FORUM.POST_DETAIL, { id }))
}

export const createPost = (data: CreatePostRequest) => {
  const formData = new FormData()

  formData.append("title", data.title)
  formData.append("content", data.content)

  if (data.image) {
    formData.append("image", data.image)
  }

  if (data.video) {
    formData.append("video", data.video)
  }

  return http.post<Response<number>>(API_ENDPOINTS.FORUM.CREATE_POST, {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const updatePost = (id: string, data: CreatePostRequest) => {
  const formData = new FormData()

  formData.append("title", data.title)
  formData.append("content", data.content)

  if (data.image) {
    formData.append("image", data.image)
  }

  if (data.video) {
    formData.append("video", data.video)
  }

  formData.append("deleteImage", String(data.deleteImage))
  formData.append("deleteVideo", String(data.deleteVideo))

  return http.put<Response<void>>(generatePath(API_ENDPOINTS.FORUM.UPDATE_POST, { id }), {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const deletePost = (id: string) => {
  return http.delete<Response<void>>(generatePath(API_ENDPOINTS.FORUM.DELETE_POST, { id }))
}

export const toggleLikePost = (id: string) => {
  return http.post<Response<void>>(generatePath(API_ENDPOINTS.FORUM.LIKE_POST, { id }))
}

export const likePost = (postId: string) => {
  return http.post<Response<ForumPost>>(generatePath(API_ENDPOINTS.FORUM.LIKE_POST, { id: postId }))
}

export const unlikePost = (postId: string) => {
  return http.delete<Response<ForumPost>>(generatePath(API_ENDPOINTS.FORUM.LIKE_POST, { id: postId }))
}

export const getComments = (postId: string, params?: { page?: number; limit?: number; order?: "ASC" | "DESC" }) => {
  return http.get<Response<ForumComment[]>>(generatePath(API_ENDPOINTS.FORUM.GET_COMMENTS, { id: postId }), {
    params: {
      page: params?.page ?? 0,
      limit: params?.limit ?? 10,
      order: params?.order ?? "DESC",
    },
  })
}
