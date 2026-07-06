import { AuthShell, CoreformLiftLoader } from "@/components/shared/coreform"
import { Button } from "@/components/shared/ui/button"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { useRegister } from "@/hooks/queries/auth/useAuthQuery"
import { REGISTER_SCHEMA } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const inputClass = "rounded-xl border-sand/60 bg-cream/50 text-earth placeholder:text-earth/40 focus-visible:border-clay"

type RegisterFormData = {
  email: string
  fullname: string
  password: string
  confirmPassword: string
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(REGISTER_SCHEMA),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  })

  const { mutate: mutateRegister, isPending: isPendingRegister } = useRegister({
    config: {
      onSuccess: () => {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.")
      },
      onError: (error) => {
        console.error("Register error:", error)
      },
    },
  })

  const handleRegister = (data: RegisterFormData) => {
    mutateRegister(data)
    navigate("/login")
  }

  return (
    <AuthShell subtitle="Tạo tài khoản để bắt đầu hành trình chuẩn hóa tư thế và theo dõi chỉ số sức khỏe.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegister)} className="w-full max-w-md">
          <div className="rounded-3xl border border-sand/60 bg-white p-8 shadow-xl shadow-earth/5 sm:p-10">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-medium text-earth">Đăng ký</h1>
              <p className="mt-2 text-sm text-earth/60">Tạo tài khoản COREFORM miễn phí.</p>
            </div>

            <div className="space-y-5">
              <SimpleField name="email" control={form.control} label="Email" required>
                {(field) => (
                  <Input {...field} type="email" placeholder="Nhập email" className={inputClass} autoComplete="email" />
                )}
              </SimpleField>

              <SimpleField name="username" control={form.control} label="Tài khoản" required>
                {(field) => (
                  <Input {...field} type="text" placeholder="Nhập tài khoản" className={inputClass} autoComplete="name" />
                )}
              </SimpleField>

              <SimpleField
                name="password"
                control={form.control}
                label="Mật khẩu"
                required
                icon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-earth/50 hover:text-earth">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              >
                {(field) => (
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    autoComplete="new-password"
                    className={`${inputClass} pr-10`}
                  />
                )}
              </SimpleField>

              <SimpleField
                name="confirmPassword"
                control={form.control}
                label="Xác nhận mật khẩu"
                required
                icon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-earth/50 hover:text-earth"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              >
                {(field) => (
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    autoComplete="confirm-password"
                    className={`${inputClass} pr-10`}
                  />
                )}
              </SimpleField>

              <Button
                className="h-auto w-full rounded-full bg-earth py-3.5 text-sm font-medium text-cream hover:bg-clay"
                disabled={isPendingRegister}
                type="submit"
              >
                {isPendingRegister ? (
                  <span className="flex items-center justify-center gap-2">
                    <CoreformLiftLoader size="sm" />
                    Đang đăng ký...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Đăng ký
                    <ArrowRight className="size-4" />
                  </span>
                )}
              </Button>
            </div>

            <p className="mt-8 text-center text-sm text-earth/60">
              Đã có tài khoản?{" "}
              <Link to="/login" className="font-medium text-clay hover:text-earth">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </AuthShell>
  )
}
