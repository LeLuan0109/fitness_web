import { AuthShell, CoreformLiftLoader } from "@/components/shared/coreform"
import { Button } from "@/components/shared/ui/button"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { ROUTES } from "@/constants/routes"
import { useForgotPassword } from "@/hooks/queries/auth/useAuthQuery"
import { FORGOT_PASSWORD_SCHEMA, ForgotPasswordDTO } from "@/schemas/forgot-password.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"

const inputClass = "rounded-xl border-sand/60 bg-cream/50 text-earth placeholder:text-earth/40 focus-visible:border-clay"

export function ForgotPasswordForm() {
  const navigate = useNavigate()
  const { mutate: forgotPassword, isPending } = useForgotPassword({
    config: {
      onSuccess: () => {
        toast.success("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến của bạn.")
        navigate(ROUTES.AUTH.LOGIN)
      },
      onError: (error) => {
        console.error("Có lỗi xảy ra:", error)
      },
    },
  })

  const form = useForm<ForgotPasswordDTO>({
    resolver: zodResolver(FORGOT_PASSWORD_SCHEMA),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  })

  const handleSubmit = (data: ForgotPasswordDTO) => {
    forgotPassword(data.email)
  }

  return (
    <AuthShell subtitle="Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-md">
          <div className="rounded-3xl border border-sand/60 bg-card p-8 shadow-xl shadow-earth/5 sm:p-10">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-earth">
                  <span className="size-2.5 rounded-full bg-clay" />
                </span>
                <span className="font-display text-xl font-bold text-earth">COREFORM</span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="font-display text-3xl font-medium text-earth">Quên mật khẩu</h1>
              <p className="mt-2 text-sm text-earth/60">Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu qua email.</p>
            </div>

            <div className="space-y-5">
              <SimpleField name="email" control={form.control} label="Email" required>
                {(field) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="example@email.com"
                    className={inputClass}
                    autoComplete="email"
                    disabled={isPending}
                  />
                )}
              </SimpleField>

              <Button
                className="h-auto w-full rounded-full bg-earth py-3.5 text-sm font-medium text-cream transition-all hover:scale-[1.01] hover:bg-clay disabled:opacity-70"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-3">
                    <CoreformLiftLoader size="sm" />
                    Đang gửi...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Gửi liên kết
                    <ArrowRight className="size-4" />
                  </span>
                )}
              </Button>

              <Button
                variant="outline"
                className="h-auto w-full rounded-full border-sand py-3.5 text-sm font-medium text-earth hover:bg-cream/80"
                type="button"
                asChild
              >
                <Link to={ROUTES.AUTH.LOGIN}>
                  <ArrowLeft className="mr-2 size-4" />
                  Quay lại đăng nhập
                </Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </AuthShell>
  )
}
