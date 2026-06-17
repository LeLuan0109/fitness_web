import { getBasicInfo } from "@/api/auth.api"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Form } from "@/components/shared/ui/form"
import { FacebookLoginButton } from "@/components/shared/ui/facebook-login-button"
import { GoogleLoginButton } from "@/components/shared/ui/google-login-button"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { DEFAULT_LOGIN_FORM_DTO } from "@/constants/auth.constant"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { ROUTES } from "@/constants/routes"
import { useLogin } from "@/hooks/queries/auth/useAuthQuery"
import { queryClient } from "@/lib/react-query"
import { router } from "@/router/router"
import { LOGIN_SCHEMA, LoginDTO } from "@/schemas/auth.schema"
import authStore from "@/stores/auth.store"
import { localStorageServices } from "@/utils/localStorageServices"
import { zodResolver } from "@hookform/resolvers/zod"
import { HttpStatusCode } from "axios"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
import { toast } from "sonner"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginDTO>({
    resolver: zodResolver(LOGIN_SCHEMA),
    defaultValues: DEFAULT_LOGIN_FORM_DTO,
    mode: "onBlur",
  })

  const { mutate: mutateLogin, isPending: isPendingLogin } = useLogin({
    config: {
      onSuccess: async (data) => {
        localStorageServices.setAccessToken(data.data?.accessToken ?? "")
        localStorageServices.setRefreshToken(data.data?.refreshToken ?? "")

        try {
          // Fetch basic info immediately after storing tokens so we can redirect based on role
          const resp = await getBasicInfo()
          const profile = resp?.data

          if (profile) {
            // set auth in store so rest of app knows the user
            authStore.getState().setAuth({
              id: profile.id,
              email: profile.email,
              username: profile.username,
              name: profile.name,
              avatar: profile.avatar,
              role: profile.role,
              isOnboardingCompleted: profile.onboardingCompleted,
            })
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.NOTIFICATIONS],
            })
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT],
            })
            // Navigate based on role name
            if (profile.role?.name === "ADMIN") {
              router.navigate(ROUTES.ADMIN.DASHBOARD)
            } else {
              router.navigate(ROUTES.HOME)
            }
            return
          }

          router.navigate(ROUTES.HOME)
        } catch (error) {
          router.navigate(ROUTES.HOME)
        }
      },
      onError: (error) => {
        if (error.response.status == HttpStatusCode.BadRequest) {
          toast.error("Đăng nhập thất bại. Vui lòng thử lại.")
        }
      },
    },
  })

  const handleLogin = (data: LoginDTO) => {
    mutateLogin(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="w-full">
        <div className="min-h-screen flex items-center justify-center p-4 auth-bg">
          {/* Glass morphism overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <Card className="relative w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground mb-2">P-FIT</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 px-8">
              <SimpleField name="username" control={form.control} label="Tên đăng nhập:" required>
                {(field) => (
                  <Input
                    {...field}
                    className="bg-white/20 border-white/30 text-foreground placeholder:text-white/70 focus:bg-white/30 focus:border-white/50"
                    autoComplete="username"
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
                    autoComplete="current-password"
                    className="bg-white/20 border-white/30 text-foreground placeholder:text-white/70 focus:bg-white/30 focus:border-white/50 pr-8"
                  />
                )}
              </SimpleField>

              <div className="text-right">
                <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-orange-400 text-sm hover:text-orange-300">
                  Quên mật khẩu?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-4 px-8 pb-3">
              <Button
                className="w-full bg-gray-600/80 hover:bg-gray-600 text-foreground font-medium py-3 rounded-lg"
                type="submit"
                disabled={isPendingLogin}
              >
                {isPendingLogin ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <div className="text-center text-foreground/80 text-sm">Hoặc đăng nhập bằng</div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <GoogleLoginButton />
                <FacebookLoginButton />
              </div>

              <div className="text-center text-foreground/80 text-sm">
                Bạn chưa có tài khoản{" "}
                <Link to="/register" className="text-orange-400 hover:text-orange-300 font-medium">
                  Đăng ký ngay!
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  )
}
