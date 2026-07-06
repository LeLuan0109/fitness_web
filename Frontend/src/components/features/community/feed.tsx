import { CoreformEmptyState, CoreformLoadingState, CoreformPageHeader } from "@/components/shared/coreform"
import { Button } from "@/components/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { useDeletePost } from "@/hooks/queries/forum/useDeletePost"
import { useGetPosts } from "@/hooks/queries/forum/useGetPosts"
import { useToggleLikePost } from "@/hooks/queries/forum/useToggleLikePost"
import authStore from "@/stores/auth.store"
import { PostSearchParams } from "@/types/forum.type"
import { Newspaper, PenLine } from "lucide-react"
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
    <div className="space-y-6">
      <CoreformPageHeader title="Cộng đồng" description="Chia sẻ tiến trình và kết nối với cộng đồng vận động viên." />

      <CreatePost
        userAvatar={auth?.avatar || "https://i.pravatar.cc/150?img=1"}
        userName={auth?.name || "User"}
        onCreateClick={handleCreatePost}
      />

      {/* Filter Tabs */}
      <FilterTabs filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Posts List */}
      {isLoading ? (
        <CoreformLoadingState />
      ) : posts.length === 0 ? (
        <CoreformEmptyState icon={Newspaper} title="Chưa có bài viết nào" />
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
        <div className="flex justify-center items-center gap-2 py-4 text-sm text-earth/50">
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
        <DialogContent className="rounded-2xl border-sand">
          <DialogHeader>
            <DialogTitle className="font-display">Xác nhận xóa bài viết</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="rounded-full border-sand" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" className="rounded-full" onClick={confirmDelete} disabled={deletePostMutation.isPending}>
              {deletePostMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
