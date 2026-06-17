import { Button } from "@/components/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog"
import { TypographyH3 } from "@/components/shared/ui/typography"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { useDeletePost } from "@/hooks/queries/forum/useDeletePost"
import { useGetPosts } from "@/hooks/queries/forum/useGetPosts"
import { useToggleLikePost } from "@/hooks/queries/forum/useToggleLikePost"
import authStore from "@/stores/auth.store"
import { PostSearchParams } from "@/types/forum.type"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { generatePath, useNavigate } from "react-router-dom"
import { CreatePost } from "./CreatePost"
import { CreatePostModal } from "./CreatePostModal"
import { EditPostModal } from "./EditPostModal"
import { PostCard } from "./PostCard"
import { FilterTabs, PostFilters } from "./FilterTabs"
import { format } from "date-fns"

export const CommunityFeed = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<PostFilters>({})
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const {
    isOpen: isCreateModalOpen,
    onOpen: onOpenCreateModal,
    onOpenChange: onOpenChangeCreateModal,
  } = useDisclosure()

  const { isOpen: isEditModalOpen, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure()

  const [searchParams, setSearchParams] = useState<PostSearchParams>({
    page: 0,
    size: 20,
    order: "DESC",
  })

  // Update search params when filters change
  const apiParams: PostSearchParams = {
    ...searchParams,
    key: filters.key,
    startDate: filters.startDate ? format(filters.startDate, "dd/MM/yyyy") : undefined,
    endDate: filters.endDate ? format(filters.endDate, "dd/MM/yyyy") : undefined,
  }

  const auth = authStore.use.auth()

  const { data, isLoading } = useGetPosts(apiParams)
  const posts = data?.posts ?? []
  const pagination = data?.pagination

  const toggleLikeMutation = useToggleLikePost()
  const deletePostMutation = useDeletePost()

  const handleCreatePost = () => {
    onOpenCreateModal()
  }

  const handlePostClick = (postId: string) => {
    navigate(generatePath(ROUTES.COMMUNITY.POST_DETAIL, { id: postId }))
  }

  const handleLike = (postId: string, isLiked: boolean) => {
    toggleLikeMutation.mutate({ postId, isLiked })
  }

  const handleEdit = (postId: string) => {
    setEditingPostId(postId)
    onOpenEditModal()
  }

  const handleDelete = (postId: string) => {
    setDeletingPostId(postId)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (deletingPostId) {
      deletePostMutation.mutate(deletingPostId, {
        onSuccess: () => {
          setShowDeleteDialog(false)
          setDeletingPostId(null)
        },
      })
    }
  }

  const handleFiltersChange = (newFilters: PostFilters) => {
    setFilters(newFilters)
    // Reset to first page when filters change
    setSearchParams((prev) => ({
      ...prev,
      page: 0,
    }))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <TypographyH3 variant="bold">Cộng đồng</TypographyH3>
      </div>

      {/* Create Post Card */}
      <CreatePost
        userAvatar={auth?.avatar || "https://i.pravatar.cc/150?img=1"}
        userName={auth?.name || "User"}
        onCreateClick={handleCreatePost}
      />

      {/* Filter Tabs */}
      <FilterTabs filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Posts List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chưa có bài viết nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id.toString()}
              title={post.title}
              author={post.author.name}
              authorAvatar={post.author.avatar}
              content={post.content}
              replies={post.commentsCount}
              likes={post.likes}
              isLiked={post.isLiked}
              createdAt={new Date(post.createdAt)}
              canEdit={post.canEdit}
              canDelete={post.canDelete}
              onLike={() => handleLike(post.id.toString(), post.isLiked)}
              onClick={() => handlePostClick(post.id.toString())}
              onEdit={() => handleEdit(post.id.toString())}
              onDelete={() => handleDelete(post.id.toString())}
            />
          ))}
        </div>
      )}

      {/* Pagination Info */}
      {pagination && posts.length > 0 && (
        <div className="flex justify-center items-center gap-2 py-4 text-sm text-muted-foreground">
          <span>
            Trang {pagination.page + 1} / {pagination.totalPages}
          </span>
          <span>•</span>
          <span>Tổng: {pagination.total} bài viết</span>
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal open={isCreateModalOpen} onOpenChange={onOpenChangeCreateModal} />

      {/* Edit Post Modal */}
      {editingPostId && (
        <EditPostModal
          open={isEditModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditingPostId(null)
              onCloseEditModal()
            }
          }}
          postId={editingPostId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deletePostMutation.isPending}>
              {deletePostMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
