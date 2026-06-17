import { Pagination } from "./common.type"

export type ForumPost = {
  id: number
  title: string
  name?: string // Có thể là tên của post
  content: string
  imageUrl?: string
  videoUrl?: string
  userId: number
  userName: string
  userAvatarUrl?: string
  likeCount: number
  commentCount: number
  liked: boolean
  canEdit: boolean
  canDelete: boolean
  createAt: string
  // Keep old fields for backward compatibility
  author?: {
    id: number
    name: string
    avatar: string
  }
  likes?: number
  commentsCount?: number
  isLiked?: boolean
  createdAt?: string
  updatedAt?: string
}

export type ForumComment = {
  id: number
  content: string
  imageUrl?: string
  userId: number
  userName: string
  userAvatarUrl?: string
  likeCount: number
  liked: boolean
  canEdit: boolean
  canDelete: boolean
  createdAt: string
  // Keep old fields for backward compatibility
  author?: {
    id: number
    name: string
    avatar: string
  }
  updatedAt?: string
}

export type PostDetail = {
  id: number
  title: string
  name?: string
  content: string
  imageUrl?: string
  videoUrl?: string
  userId: number
  userName: string
  userAvatarUrl?: string
  likeCount: number
  commentCount: number
  liked: boolean
  canEdit: boolean
  canDelete: boolean
  createAt: string
  // Keep old fields for backward compatibility
  author?: {
    id: number
    name: string
    avatar: string
  }
  likes?: number
  isLiked?: boolean
  comments?: ForumComment[]
  createdAt?: string
  updatedAt?: string
}

export type CreatePostRequest = {
  title: string
  content: string
  image?: File
  video?: File
  deleteImage?: boolean
  deleteVideo?: boolean
}

export type CreateCommentRequest = {
  postId: number
  content: string
}

export type PostSearchParams = {
  key?: string // Tìm kiếm theo key
  page?: number // Default: 0
  size?: number // Default: 10 (renamed from limit)
  order?: "ASC" | "DESC" // Default: DESC
  startDate?: string // Format: dd/MM/yyyy
  endDate?: string // Format: dd/MM/yyyy
  // Keep old fields for backward compatibility
  search?: string
  sortBy?: "hot" | "new" | "top"
  limit?: number
}

export type PostCriteria = {
  key?: string
  startDate?: string // Format: dd/MM/yyyy
  endDate?: string // Format: dd/MM/yyyy
  page?: number
  limit?: number
}

export type PostListResponse = {
  data: ForumPost[]
  pagination: Pagination
  meta?: Pagination // Alias for pagination
}
