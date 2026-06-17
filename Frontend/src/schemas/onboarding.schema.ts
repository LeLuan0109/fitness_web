import { vStringRequired } from "@/constants/validates"
import z from "zod"

export const ONBOARDING_FORM_SCHEMA = z.object({
  sex: z.string().nonempty("Giới tính là trường bắt buộc"),
  dateOfBirth: z.date({
    required_error: "Ngày sinh là trường bắt buộc",
    invalid_type_error: "Ngày sinh không hợp lệ",
  }),
  weight: vStringRequired("Cân nặng"),
  height: vStringRequired("Chiều cao"),
  fitnessGoal: vStringRequired("Mục tiêu tập luyện"),
  activityLevel: vStringRequired("Mức độ hoạt động"),
})

export type OnboardingFormData = z.infer<typeof ONBOARDING_FORM_SCHEMA>
