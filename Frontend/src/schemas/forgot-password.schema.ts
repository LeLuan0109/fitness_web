import z from "zod"

export const FORGOT_PASSWORD_SCHEMA = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
})
export type ForgotPasswordDTO = z.infer<typeof FORGOT_PASSWORD_SCHEMA>
