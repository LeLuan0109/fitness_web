import { z } from "zod"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/mpeg", "video/webm"]

export const EXERCISE_SCHEMA = z.object({
  name: z.string().min(1, "Tên bài tập là bắt buộc"),
  level: z.string().min(1, "Cấp độ là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  trainingTypeId: z.string().min(1, "Loại hình tập luyện là bắt buộc"),
  met: z.string().min(1, "MET là bắt buộc"),

  thumbnail: z
    .instanceof(FileList)
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true
      return files[0].size <= MAX_FILE_SIZE
    }, "Kích thước ảnh tối đa 10MB")
    .refine((files) => {
      if (!files || files.length === 0) return true
      return ACCEPTED_IMAGE_TYPES.includes(files[0].type)
    }, "Chỉ chấp nhận định dạng .jpg, .jpeg, .png, .webp"),

  video: z
    .instanceof(FileList)
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true
      return files[0].size <= MAX_FILE_SIZE
    }, "Kích thước video tối đa 10MB")
    .refine((files) => {
      if (!files || files.length === 0) return true
      return ACCEPTED_VIDEO_TYPES.includes(files[0].type)
    }, "Chỉ chấp nhận định dạng .mp4, .mpeg, .webm"),

  equipmentIds: z.array(z.string()).default([]),
  primaryMuscleGroupIds: z.array(z.string()).min(1, "Chọn ít nhất 1 nhóm cơ chính"),
  secondaryMuscleGroupIds: z.array(z.string()).default([]),

  // ✅ Thay đổi từ array of strings thành array of objects
  steps: z.array(z.object({ value: z.string() })).min(1, "Thêm ít nhất 1 bước thực hiện"),
  tips: z.array(z.object({ value: z.string() })).default([]),
  mistakes: z.array(z.object({ value: z.string() })).default([]),
  benefits: z.array(z.object({ value: z.string() })).default([]),
})

export type ExerciseFormDTO = z.infer<typeof EXERCISE_SCHEMA>

export const DEFAULT_EXERCISE_FORM: ExerciseFormDTO = {
  name: "",
  level: "",
  description: "",
  trainingTypeId: "",
  met: "",
  equipmentIds: [],
  primaryMuscleGroupIds: [],
  secondaryMuscleGroupIds: [],
  steps: [{ value: "" }],
  tips: [{ value: "" }],
  mistakes: [{ value: "" }],
  benefits: [{ value: "" }],
}
