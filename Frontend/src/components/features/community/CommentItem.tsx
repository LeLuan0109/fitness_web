import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar"
import { Button } from "@/components/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shared/ui/dropdown-menu"
import { Textarea } from "@/components/shared/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog"
import { useDeleteComment } from "@/hooks/queries/forum/useDeleteComment"
import { useUpdateComment } from "@/hooks/queries/forum/useUpdateComment"
import { useToggleLikeComment } from "@/hooks/queries/forum/useToggleLikeComment"
import { ForumComment } from "@/types/forum.type"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale/vi"
import { Image as ImageIcon, MoreVertical, Pencil, Trash2, X, Heart } from "lucide-react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

type CommentItemProps = {
  comment: ForumComment
  postId: string
  currentUserId?: number
}

export function CommentItem({ comment, postId, currentUserId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [editImage, setEditImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(comment.imageUrl || null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [hasOriginalImage, setHasOriginalImage] = useState(!!comment.imageUrl) // Track if comment originally had image
  const [deleteImage, setDeleteImage] = useState(false) // Flag to delete image
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()
  const toggleLikeMutation = useToggleLikeComment()

  const canEdit = comment.canEdit || comment.userId === currentUserId
  const canDelete = comment.canDelete || comment.userId === currentUserId

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Reset deleteImage flag when selecting new image
      setDeleteImage(false)
    }
  }

  const handleRemoveImage = () => {
    // If removing an image that was originally from the server, set deleteImage flag
    if (hasOriginalImage && !editImage) {
      setDeleteImage(true)
    }

    setEditImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(comment.content)
    setEditImage(null)
    setImagePreview(comment.imageUrl || null)
    setDeleteImage(false) // Reset deleteImage flag when canceling
    setHasOriginalImage(!!comment.imageUrl) // Reset to original state
  }

  const handleSaveEdit = () => {
    if (!editContent.trim()) return

    updateCommentMutation.mutate(
      {
        id: comment.id.toString(),
        data: {
          postId: postId,
          content: editContent.trim(),
          image: editImage || undefined,
          deleteImage: deleteImage || undefined, // Include deleteImage flag if true
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false)
          setEditImage(null)
          setDeleteImage(false)
          setHasOriginalImage(false) // After successful save, no more original image
        },
      },
    )
  }

  const handleDelete = () => {
    deleteCommentMutation.mutate(
      {
        id: comment.id.toString(),
        postId: postId,
      },
      {
        onSuccess: () => {
          setShowDeleteDialog(false)
        },
      },
    )
  }

  const handleToggleLike = () => {
    toggleLikeMutation.mutate({
      commentId: comment.id.toString(),
      postId: postId,
      isLiked: comment.liked,
    })
  }

  if (isEditing) {
    return (
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author?.avatar} alt={comment.author?.name} />
          <AvatarFallback>{comment.author?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[80px] resize-none"
            disabled={updateCommentMutation.isPending}
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg border" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={handleRemoveImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
              disabled={updateCommentMutation.isPending}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={updateCommentMutation.isPending}
              className="gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              {imagePreview ? "Đổi ảnh" : "Thêm ảnh"}
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={handleCancelEdit} disabled={updateCommentMutation.isPending}>
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={!editContent.trim() || updateCommentMutation.isPending}
            >
              {updateCommentMutation.isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex gap-3 group">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author?.avatar} alt={comment.author?.name} />
          <AvatarFallback>{comment.author?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-sm">{comment.author?.name}</p>
              {(canEdit || canDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canEdit && (
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
            {comment.imageUrl && (
              <div className="mt-2">
                <img src={comment.imageUrl} alt="Comment attachment" className="max-h-60 rounded-lg border" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 ml-3">
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 px-2 gap-1",
                comment.liked ? "text-red-500 hover:text-red-600" : "text-muted-foreground",
              )}
              onClick={handleToggleLike}
              disabled={toggleLikeMutation.isPending}
            >
              <Heart className={cn("h-3 w-3", comment.liked && "fill-current")} />
              <span className="text-xs font-medium">{comment.likeCount || 0}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bình luận</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteCommentMutation.isPending}>
              {deleteCommentMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
