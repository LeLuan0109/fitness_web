import { vStringRequired } from "@/constants/validates"
import { PASSWORD_REGEX } from "@/utils/regex"
import z from "zod"

export const CHANGE_PASSWORD_SCHEMA = z
  .object({
    oldPassword: z.string().min(8, "Mật khẩu hiện tại phải có ít nhất 8 ký tự"),
    newPassword: vStringRequired("Mật khẩu mới")
      .max(256, "Mật khẩu mới không được vượt quá 256 ký tự")
      .regex(PASSWORD_REGEX, "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt (@$!%*?&)"),
    confirmNewPassword: vStringRequired("Mật khẩu xác nhận"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  })
export type ChangePasswordDTO = z.infer<typeof CHANGE_PASSWORD_SCHEMA>
