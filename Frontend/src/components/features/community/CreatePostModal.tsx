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
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { useCreatePost } from "@/hooks/queries/forum/useCreatePost"
import { queryClient } from "@/lib/react-query"
import { CreatePostFormData, createPostSchema } from "@/schemas/post.schema"
import { CreatePostRequest } from "@/types/forum.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, X } from "lucide-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreatePostModal = ({ open, onOpenChange }: CreatePostModalProps) => {
  const [image, setImage] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  const { mutate: createPost, isPending } = useCreatePost()

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
  }

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImage(null)
    setImagePreview(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
  }

  const handleRemoveVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
    setVideo(null)
    setVideoPreview(null)
    if (videoInputRef.current) {
      videoInputRef.current.value = ""
    }
  }

  const onSubmit = (data: CreatePostFormData) => {
    const payload: CreatePostRequest = {
      title: data.title.trim(),
      content: data.content,
      image: image || undefined,
      video: video || undefined,
    }

    createPost(payload, {
      onSuccess: () => {
        // Reset form
        form.reset()
        handleRemoveImage()
        handleRemoveVideo()
        onOpenChange(false)
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.MY_POSTS] })
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM.POSTS] })
      },
    })
  }

  const handleCancel = () => {
    // Clean up object URLs
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    if (videoPreview) URL.revokeObjectURL(videoPreview)

    form.reset()
    setImage(null)
    setVideo(null)
    setImagePreview(null)
    setVideoPreview(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
          <DialogDescription>Chia sẻ suy nghĩ của bạn với cộng đồng</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Title Input */}
            <SimpleField control={form.control} name="title" label="Tiêu đề" required>
              {(field) => <Input {...field} placeholder="Nhập tiêu đề bài viết..." disabled={isPending} />}
            </SimpleField>

            {/* Content TextArea */}
            <SimpleField control={form.control} name="content" label="Nội dung" required>
              {(field) => (
                <textarea
                  {...field}
                  placeholder="Viết nội dung bài viết của bạn..."
                  className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isPending}
                />
              )}
            </SimpleField>

            {/* Image Upload */}
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
                className="w-full"
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

            {/* Video Upload */}
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
                className="w-full"
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng...
                  </>
                ) : (
                  "Đăng bài"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
