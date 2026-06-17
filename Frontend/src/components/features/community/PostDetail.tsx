import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar"
import { Button } from "@/components/shared/ui/button"
import { Card } from "@/components/shared/ui/card"
import { Skeleton } from "@/components/shared/ui/skeleton"
import { Textarea } from "@/components/shared/ui/textarea"
import { CommentItem } from "@/components/features/community/CommentItem"
import { useCreateComment } from "@/hooks/queries/forum/useCreateComment"
import { useGetComments } from "@/hooks/queries/forum/useGetComments"
import { useGetPostDetail } from "@/hooks/queries/forum/useGetPostDetail"
import { useToggleLikePost } from "@/hooks/queries/forum/useToggleLikePost"
import { cn } from "@/lib/utils"
import authStore from "@/stores/auth.store"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale/vi"
import { ArrowLeft, Heart, MessageSquare, Send, Image as ImageIcon, X } from "lucide-react"
import { useState, useRef } from "react"
import { useNavigate, useParams } from "react-router"

export function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: post, isLoading } = useGetPostDetail(id)
  const { data: commentsData, isLoading: isLoadingComments } = useGetComments(id, {
    page: 0,
    limit: 50,
    order: "DESC",
  })
  const comments = commentsData?.comments ?? []
  const toggleLikeMutation = useToggleLikePost()
  const createCommentMutation = useCreateComment()

  const [commentContent, setCommentContent] = useState("")
  const [commentImage, setCommentImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const auth = authStore.use.auth()

  const handleLike = () => {
    if (!post) return
    toggleLikeMutation.mutate({ postId: post.id.toString(), isLiked: post.isLiked })
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCommentImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setCommentImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmitComment = () => {
    if (!commentContent.trim() || !post) return

    createCommentMutation.mutate(
      {
        postId: post.id.toString(),
        content: commentContent.trim(),
        image: commentImage || undefined,
      },
      {
        onSuccess: () => {
          setCommentContent("")
          setCommentImage(null)
          setImagePreview(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Không tìm thấy bài viết</p>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Button variant="ghost" onClick={handleBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>

      {/* Post Content */}
      <Card className="p-6 gap-4">
        {/* Author Info */}
        <div className="flex items-center gap-3 ">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
            </p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

        {/* Content */}
        <div className="prose prose-sm max-w-none mb-6">
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Image Preview */}
        {post.imageUrl && (
          <div className="mb-6">
            <img src={post.imageUrl} alt={post.title} className="w-full max-h-[600px] object-cover rounded-lg border" />
          </div>
        )}

        {/* Video Preview */}
        {post.videoUrl && (
          <div className="mb-6">
            <video src={post.videoUrl} controls className="w-full max-h-[600px] rounded-lg border">
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className={cn("gap-2", post.isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground")}
            onClick={handleLike}
            disabled={toggleLikeMutation.isPending}
          >
            <Heart className={cn("h-5 w-5", post.isLiked && "fill-current")} />
            <span className="font-medium">{post.likes}</span>
          </Button>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">{post.commentCount} bình luận</span>
          </div>
        </div>
      </Card>

      {/* Comment Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Bình luận</h2>

        {/* Comment Input */}
        <div className="flex gap-3 mb-6">
          <Avatar className="h-8 w-8">
            <AvatarImage src={auth?.avatar || "https://i.pravatar.cc/150?img=1"} alt={auth?.name || "User"} />
            <AvatarFallback>{auth?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Viết bình luận của bạn..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={createCommentMutation.isPending}
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
                disabled={createCommentMutation.isPending}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={createCommentMutation.isPending}
                className="gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Thêm ảnh
              </Button>
              <div className="flex-1" />
              <Button
                onClick={handleSubmitComment}
                disabled={!commentContent.trim() || createCommentMutation.isPending}
                size="sm"
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {createCommentMutation.isPending ? "Đang gửi..." : "Gửi"}
              </Button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {isLoadingComments ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Chưa có bình luận nào</p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id.toString()}
                currentUserId={auth?.id ? parseInt(auth.id) : undefined}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
