import { CoreformLiftLoader } from "@/components/shared/coreform"
import { coreformDialogContentWideClass, coreformInputClass, coreformTextareaClass } from "@/components/shared/coreform/coreform-modal"
import { Button } from "@/components/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { Label } from "@/components/shared/ui/label"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { MAX_FILE_SIZE } from "@/constants/common"
import { useGetPostDetail } from "@/hooks/queries/forum/useGetPostDetail"
import { useUpdatePost } from "@/hooks/queries/forum/useUpdatePost"
import { cn } from "@/lib/utils"
import { CreatePostFormData, createPostSchema } from "@/schemas/post.schema"
import { CreatePostRequest } from "@/types/forum.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface EditPostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  appearance?: "user" | "admin"
}

export const EditPostModal = ({ open, onOpenChange, postId, appearance = "user" }: EditPostModalProps) => {
  const [image, setImage] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [hasOriginalImage, setHasOriginalImage] = useState(false) // Track if post originally had image
  const [hasOriginalVideo, setHasOriginalVideo] = useState(false) // Track if post originally had video
  const [deleteImage, setDeleteImage] = useState(false) // Flag to delete image
  const [deleteVideo, setDeleteVideo] = useState(false) // Flag to delete video
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const { data: post, isLoading: isLoadingPost } = useGetPostDetail(postId)
  const { mutate: updatePost, isPending } = useUpdatePost()

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  // Set form values when post data is loaded
  useEffect(() => {
    if (post) {
      console.log("post")
      form.setValue("title", post.title)
      form.setValue("content", post.content)

      // Set image preview from existing post
      if (post.imageUrl) {
        setImagePreview(post.imageUrl)
        setHasOriginalImage(true) // Mark that post has original image
      } else {
        setHasOriginalImage(false)
      }

      // Set video preview from existing post
      if (post.videoUrl) {
        setVideoPreview(post.videoUrl)
        setHasOriginalVideo(true) // Mark that post has original video
      } else {
        setHasOriginalVideo(false)
      }

      // Reset delete flags when loading new post
      setDeleteImage(false)
      setDeleteVideo(false)
    }
  }, [post, form])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 50MB)
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Ảnh quá lớn. Kích thước tối đa là 50MB`)
      return
    }

    // Create preview
    const preview = URL.createObjectURL(file)
    setImage(file)
    setImagePreview(preview)

    // Reset deleteImage flag when selecting new image
    setDeleteImage(false)
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 50MB)
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Video quá lớn. Kích thước tối đa là 50MB`)
      return
    }

    // Create preview
    const preview = URL.createObjectURL(file)
    setVideo(file)
    setVideoPreview(preview)

    // Reset deleteVideo flag when selecting new video
    setDeleteVideo(false)
  }

  const handleRemoveImage = () => {
    if (imagePreview) {
      // Only revoke if it's a blob URL (not from server)
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }

    // If removing an image that was originally from the server, set deleteImage flag
    if (hasOriginalImage && !image) {
      setDeleteImage(true)
    }

    setImage(null)
    setImagePreview(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
  }

  const handleRemoveVideo = () => {
    if (videoPreview) {
      // Only revoke if it's a blob URL (not from server)
      if (videoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreview)
      }
    }

    // If removing a video that was originally from the server, set deleteVideo flag
    if (hasOriginalVideo && !video) {
      setDeleteVideo(true)
    }

    setVideo(null)
    setVideoPreview(null)
    if (videoInputRef.current) {
      videoInputRef.current.value = ""
    }
  }

  const onSubmit = (data: CreatePostFormData) => {
    console.log("deleteImage: ", deleteImage)
    console.log("deleteVideo: ", deleteVideo)
    const payload: CreatePostRequest = {
      title: data.title.trim(),
      content: data.content,
      image: image || undefined,
      video: video || undefined,
      deleteImage: deleteImage || false, // Include deleteImage flag if true
      deleteVideo: deleteVideo || false, // Include deleteVideo flag if true
    }

    updatePost(
      { id: postId, data: payload },
      {
        onSuccess: () => {
          form.reset()
          handleRemoveImage()
          handleRemoveVideo()
          setDeleteImage(false)
          setDeleteVideo(false)
          setHasOriginalImage(false)
          setHasOriginalVideo(false)
          onOpenChange(false)
        },
      },
    )
  }

  const handleCancel = () => {
    // Only revoke blob URLs (not server URLs)
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
    if (videoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview)
    }
    form.reset()
    setImage(null)
    setVideo(null)
    setImagePreview(null)
    setVideoPreview(null)
    setDeleteImage(false)
    setDeleteVideo(false)
    onOpenChange(false)
  }

  if (isLoadingPost) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={coreformDialogContentWideClass}>
          <div className="flex justify-center py-12">
            <CoreformLiftLoader label="Đang tải bài viết..." />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={coreformDialogContentWideClass}>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
          <DialogDescription>Cập nhật nội dung bài viết của bạn</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
            <SimpleField control={form.control} name="title" label="Tiêu đề" required>
              {(field) => (
                <Input {...field} placeholder="Nhập tiêu đề bài viết..." disabled={isPending} className={coreformInputClass} />
              )}
            </SimpleField>

            <SimpleField control={form.control} name="content" label="Nội dung" required>
              {(field) => (
                <textarea
                  {...field}
                  placeholder="Viết nội dung bài viết của bạn..."
                  className={coreformTextareaClass}
                  disabled={isPending}
                />
              )}
            </SimpleField>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="image">Hình ảnh (không bắt buộc)</Label>
              <input
                ref={imageInputRef}
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
                disabled={isPending}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                disabled={isPending}
                className={cn(
                  "w-full rounded-full",
                  appearance === "admin" ? "border-border bg-muted/50" : "border-sand bg-cream/50",
                )}
              >
                Chọn hình ảnh
              </Button>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isPending}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Video Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="video">Video (không bắt buộc)</Label>
              <input
                ref={videoInputRef}
                type="file"
                id="video"
                accept="video/*"
                className="hidden"
                onChange={handleVideoSelect}
                disabled={isPending}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                disabled={isPending}
                className={cn(
                  "w-full rounded-full",
                  appearance === "admin" ? "border-border bg-muted/50" : "border-sand bg-cream/50",
                )}
              >
                Chọn video
              </Button>

              {/* Video Preview */}
              {videoPreview && (
                <div className="relative group">
                  <video src={videoPreview} controls className="w-full h-64 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isPending}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className={cn("rounded-full", appearance === "admin" ? "border-border" : "border-sand")}
                onClick={handleCancel}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className={cn(
                  "rounded-full",
                  appearance === "admin"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-earth text-cream hover:bg-clay",
                )}
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <CoreformLiftLoader size="sm" />
                    Đang cập nhật...
                  </span>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
