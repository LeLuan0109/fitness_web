import { z } from "zod"

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Vui lòng nhập tiêu đề")
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  content: z.string().min(1, "Vui lòng nhập nội dung").min(10, "Nội dung phải có ít nhất 10 ký tự"),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>
