import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { ROUTES } from "@/constants/routes"
import { useForgotPassword } from "@/hooks/queries/auth/useAuthQuery"
import { FORGOT_PASSWORD_SCHEMA, ForgotPasswordDTO } from "@/schemas/forgot-password.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Mail, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export function ForgotPasswordForm() {
  const navigate = useNavigate()
  const { mutate: forgotPassword } = useForgotPassword({
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

  const handleCancel = () => {
    navigate(ROUTES.AUTH.LOGIN)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
        <div className="min-h-screen flex items-center justify-center p-4 auth-bg">
          {/* Glass morphism overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <Card className="relative w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground mb-2">Quên mật khẩu</CardTitle>
              <p className="text-foreground/80 text-sm">Nhập email để đặt lại mật khẩu</p>
            </CardHeader>

            <CardContent className="space-y-4 px-8">
              <SimpleField
                name="email"
                control={form.control}
                label="Email:"
                required
                icon={<Mail className="w-4 h-4 ml-3 absolute top-1/2 transform -translate-y-1/2  text-foreground/70" />}
                iconPosition="start"
              >
                {(field) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="example@email.com"
                    className="bg-white/20 border-white/30 text-foreground placeholder:text-white/70 focus:bg-white/30 focus:border-white/50 pl-10"
                    autoComplete="email"
                  />
                )}
              </SimpleField>
            </CardContent>

            <CardFooter className="flex-col gap-3 px-8 pb-8">
              <Button
                variant="default"
                className="w-full font-medium py-3 rounded-lg"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                <Send />
                {form.formState.isSubmitting ? "Đang gửi..." : "Gửi"}
              </Button>

              <Button
                variant="outline"
                className="w-full bg-transparent border-white/30 text-foreground hover:bg-white/10"
                type="button"
                onClick={handleCancel}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Hủy
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  )
}
