import { z } from "zod"

import { vStringPassword, vStringRequired } from "@/constants/validates"

export const LOGIN_SCHEMA = z.object({
  username: vStringRequired("Tên đăng nhập"),
  // Đăng nhập chỉ kiểm tra bắt buộc nhập, KHÔNG áp ràng buộc độ phức tạp (việc đó thuộc về đăng ký).
  // Áp regex phức tạp ở form login sẽ khóa các tài khoản hợp lệ có mật khẩu cũ/ngắn.
  password: vStringRequired("Mật khẩu"),
})

export const REGISTER_SCHEMA = z
  .object({
    email: z.string({ required_error: "Email là bắt buộc" }).email("Email không hợp lệ"),
    username: vStringRequired("Tên đăng nhập").min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    password: vStringPassword(),
    confirmPassword: z
      .string({ required_error: "Xác nhận mật khẩu là bắt buộc" })
      .min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })

export type LoginDTO = z.infer<typeof LOGIN_SCHEMA>
export type RegisterDTO = z.infer<typeof REGISTER_SCHEMA>
