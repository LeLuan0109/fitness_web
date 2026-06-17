import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { useRegister } from "@/hooks/queries/auth/useAuthQuery"
import { REGISTER_SCHEMA } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="w-full">
        <div className="min-h-screen flex items-center justify-center p-4 auth-bg">
          {/* Glass morphism overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <Card className="relative w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground mb-2">P-FIT</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 px-8">
              <SimpleField name="email" control={form.control} label="Email:" required>
                {(field) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="bg-white/20 border-white/30 text-foreground placeholder:text-white/70 focus:bg-white/30 focus:border-white/50"
                    autoComplete="email"
                  />
                )}
              </SimpleField>

              <SimpleField name="username" control={form.control} label="Tài khoản:" required>
                {(field) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nhập tài khoản"
                    className="bg-white/20 border-white/30 text-foreground placeholder:text-white/70 focus:bg-white/30 focus:border-white/50"
                    autoComplete="name"
                  />
                )}
              </SimpleField>

              <SimpleField
                name="password"
                control={form.control}
                label="Mật khẩu:"
                required
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pr-3 text-foreground/70 hover:text-foreground"
                  >
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
                    className="bg-white/20 border-white/30 text-foreground placeholder:text-white/70 focus:bg-white/30 focus:border-white/50"
                  />
                )}
              </SimpleField>

              <SimpleField
                name="confirmPassword"
                control={form.control}
                label="Xác nhận mật khẩu:"
                required
                icon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="pr-3 text-foreground/70 hover:text-foreground"
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
                    className="bg-white/20 border-white/30 text-foreground placeholder:text-white/70 focus:bg-white/30 focus:border-white/50"
                  />
                )}
              </SimpleField>
            </CardContent>

            <CardFooter className="flex-col gap-4 px-8 pb-3">
              <Button
                className="w-full bg-gray-600/80 hover:bg-gray-600 text-foreground font-medium py-3 rounded-lg"
                disabled={isPendingRegister}
                type="submit"
              >
                Đăng ký
              </Button>

              <div className="text-center text-foreground/80 text-sm">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium">
                  Đăng nhập ngay!
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  )
}
