import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Response } from "@/types/common.type"
import { ForumComment } from "@/types/forum.type"
import { generatePath } from "react-router"

export type CreateCommentRequest = {
  postId: string
  content: string
  image?: File
}

export type UpdateCommentRequest = {
  postId: string
  content: string
  image?: File
  deleteImage?: boolean
}

export const getCommentDetail = (id: string) => {
  return http.get<Response<ForumComment>>(generatePath(API_ENDPOINTS.COMMENTS.GET_DETAIL, { id }))
}

export const createComment = (data: CreateCommentRequest) => {
  const formData = new FormData()

  formData.append("postId", data.postId)
  formData.append("content", data.content)

  if (data.image) {
    formData.append("image", data.image)
  }

  return http.post<Response<ForumComment>>(API_ENDPOINTS.COMMENTS.CREATE, {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const updateComment = (id: string, data: UpdateCommentRequest) => {
  const formData = new FormData()

  formData.append("postId", data.postId)
  formData.append("content", data.content)

  if (data.image) {
    formData.append("image", data.image)
  }

  return http.put<Response<ForumComment>>(generatePath(API_ENDPOINTS.COMMENTS.EDIT, { id }), {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const deleteComment = (id: string) => {
  return http.delete<Response<void>>(generatePath(API_ENDPOINTS.COMMENTS.DELETE, { id }))
}

export const likeComment = (commentId: string) => {
  return http.post<Response<ForumComment>>(generatePath(API_ENDPOINTS.COMMENTS.LIKE, { id: commentId }))
}

export const unlikeComment = (commentId: string) => {
  return http.delete<Response<ForumComment>>(generatePath(API_ENDPOINTS.COMMENTS.LIKE, { id: commentId }))
}
