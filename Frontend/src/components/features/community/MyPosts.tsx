import { CoreformEmptyState, CoreformLoadingState, CoreformPageHeader, CoreformPrimaryButton } from "@/components/shared/coreform"
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
import { useGetMyPosts } from "@/hooks/queries/forum/useGetMyPosts"
import { useToggleLikePost } from "@/hooks/queries/forum/useToggleLikePost"
import authStore from "@/stores/auth.store"
import { PostSearchParams } from "@/types/forum.type"
import { format } from "date-fns"
import { PenLine } from "lucide-react"
import { useState } from "react"
import { generatePath, useNavigate } from "react-router-dom"
import { CreatePost } from "./CreatePost"
import { CreatePostModal } from "./CreatePostModal"
import { EditPostModal } from "./EditPostModal"
import { PostCard } from "./PostCard"
import { FilterTabs, PostFilters } from "./FilterTabs"

export const MyPosts = () => {
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

  const apiParams: PostSearchParams = {
    ...searchParams,
    key: filters.key,
    startDate: filters.startDate ? format(filters.startDate, "dd/MM/yyyy") : undefined,
    endDate: filters.endDate ? format(filters.endDate, "dd/MM/yyyy") : undefined,
  }

  const auth = authStore.use.auth()

  const { data, isLoading } = useGetMyPosts(apiParams)
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
    setSearchParams((prev) => ({
      ...prev,
      page: 0,
    }))
  }

  return (
    <div className="space-y-6">
      <CoreformPageHeader title="Bài viết của tôi" description="Quản lý và chia sẻ bài viết cá nhân của bạn." />

      <CreatePost
        userAvatar={auth?.avatar || "https://i.pravatar.cc/150?img=1"}
        userName={auth?.name || "User"}
        onCreateClick={handleCreatePost}
      />

      <FilterTabs filters={filters} onFiltersChange={handleFiltersChange} />

      {isLoading ? (
        <CoreformLoadingState />
      ) : posts.length === 0 ? (
        <CoreformEmptyState
          icon={PenLine}
          title={
            filters.key || filters.startDate || filters.endDate
              ? "Không tìm thấy bài viết nào"
              : "Bạn chưa có bài viết nào"
          }
          action={
            !filters.key && !filters.startDate && !filters.endDate ? (
              <CoreformPrimaryButton onClick={handleCreatePost}>Tạo bài viết đầu tiên</CoreformPrimaryButton>
            ) : undefined
          }
        />
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

      {pagination && posts.length > 0 && (
        <div className="flex justify-center items-center gap-2 py-4 text-sm text-earth/50">
          <span>
            Trang {pagination.page + 1} / {pagination.totalPages}
          </span>
          <span>•</span>
          <span>Tổng: {pagination.total} bài viết</span>
        </div>
      )}

      <CreatePostModal open={isCreateModalOpen} onOpenChange={onOpenChangeCreateModal} />

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
