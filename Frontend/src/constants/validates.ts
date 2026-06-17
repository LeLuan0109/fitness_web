import { z } from "zod"

import { MAX_LENGTH } from "@/constants/common"

const PASSWORD_VALIDATION = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

export const vStringPassword = () =>
  z
    .string({ required_error: "Mật khẩu là trường bắt buộc" })
    .min(1, { message: "Mật khẩu là trường bắt buộc" })
    .max(MAX_LENGTH[255], {
      message: "Mật khẩu không được vượt quá 255 ký tự",
    })
    .regex(PASSWORD_VALIDATION, {
      message: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm cả chữ cái và số",
    })

export const vStringEmail = () => {
  return z.string().min(1, { message: "Email là trường bắt buộc" }).email({ message: "Email không hợp lệ!" })
}

export const vStringRequired = (field: string) =>
  z.string({ required_error: `${field} là trường bắt buộc` }).min(1, { message: `${field} là trường bắt buộc` })

export const vStringOptional = () => z.string().optional()
