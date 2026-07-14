import { z } from "zod"

import { MAX_LENGTH } from "@/constants/common"
import { PASSWORD_REGEX } from "@/utils/regex"

export const vStringPassword = () =>
  z
    .string({ required_error: "Mật khẩu là trường bắt buộc" })
    .min(1, { message: "Mật khẩu là trường bắt buộc" })
    .max(MAX_LENGTH[255], {
      message: "Mật khẩu không được vượt quá 255 ký tự",
    })
    .regex(PASSWORD_REGEX, {
      message: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ít nhất 1 ký tự đặc biệt",
    })

export const vStringEmail = () => {
  return z.string().min(1, { message: "Email là trường bắt buộc" }).email({ message: "Email không hợp lệ!" })
}

export const vStringRequired = (field: string) =>
  z.string({ required_error: `${field} là trường bắt buộc` }).min(1, { message: `${field} là trường bắt buộc` })

export const vStringOptional = () => z.string().optional()
