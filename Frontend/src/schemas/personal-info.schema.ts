import { vStringRequired } from "@/constants/validates"
import z from "zod"

export const PERSONAL_INFO_SCHEMA = z.object({
  name: z.string().optional(),
  avatar: z.string().optional(),
  email: z.string().email(),
  dateOfBirth: z.date(),
  height: vStringRequired("Chiều cao").refine((val) => !isNaN(Number(val)), {
    message: "Chiều cao phải là một số",
  }),
  weight: vStringRequired("Cân nặng").refine((val) => !isNaN(Number(val)), {
    message: "Cân nặng phải là một số",
  }),
  activityLevel: vStringRequired("Mức độ hoạt động"),
  gender: z.string().optional(),
  fitnessGoal: vStringRequired("Mục tiêu tập luyện"),
})
