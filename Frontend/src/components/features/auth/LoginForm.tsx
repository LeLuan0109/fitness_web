import { getBasicInfo } from "@/api/auth.api"
import { AuthShell, CoreformLiftLoader } from "@/components/shared/coreform"
import { Button } from "@/components/shared/ui/button"
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
import transitionStore from "@/stores/transition.store"
import { localStorageServices } from "@/utils/localStorageServices"
import { zodResolver } from "@hookform/resolvers/zod"
import { HttpStatusCode } from "axios"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
import { toast } from "sonner"

const inputClass = "rounded-xl border-sand/60 bg-cream/50 text-earth placeholder:text-earth/40 focus-visible:border-clay"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginDTO>({
    resolver: zodResolver(LOGIN_SCHEMA),
    defaultValues: DEFAULT_LOGIN_FORM_DTO,
    mode: "onBlur",
  })

  const navigateAfterLogin = (route: string) => {
    transitionStore.getState().playEnter(() => {
      router.navigate(route)
    })
  }

  const { mutate: mutateLogin, isPending: isPendingLogin } = useLogin({
    config: {
      onSuccess: async (data) => {
        localStorageServices.setAccessToken(data.data?.accessToken ?? "")
        localStorageServices.setRefreshToken(data.data?.refreshToken ?? "")

        try {
          const resp = await getBasicInfo()
          const profile = resp?.data

          if (profile) {
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

            if (profile.role?.name === "ADMIN") {
              navigateAfterLogin(ROUTES.ADMIN.DASHBOARD)
            } else {
              navigateAfterLogin(ROUTES.HOME)
            }
            return
          }

          navigateAfterLogin(ROUTES.HOME)
        } catch {
          navigateAfterLogin(ROUTES.HOME)
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
    <AuthShell>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="w-full max-w-md">
          <div className="rounded-3xl border border-sand/60 bg-white p-8 shadow-xl shadow-earth/5 sm:p-10">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-earth">
                  <span className="size-2.5 rounded-full bg-clay" />
                </span>
                <span className="font-display text-xl font-bold text-earth">COREFORM</span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="font-display text-3xl font-medium text-earth">Đăng nhập</h1>
              <p className="mt-2 text-sm text-earth/60">Chào mừng trở lại. Tiếp tục hành trình của bạn.</p>
            </div>

            <div className="space-y-5">
              <SimpleField name="username" control={form.control} label="Tên đăng nhập" required>
                {(field) => <Input {...field} className={inputClass} autoComplete="username" disabled={isPendingLogin} />}
              </SimpleField>

              <SimpleField
                name="password"
                control={form.control}
                label="Mật khẩu"
                required
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-earth/50 hover:text-earth"
                    tabIndex={-1}
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
                    className={`${inputClass} pr-10`}
                    disabled={isPendingLogin}
                  />
                )}
              </SimpleField>

              <div className="text-right">
                <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-sm font-medium text-clay hover:text-earth">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                className="h-auto w-full rounded-full bg-earth py-3.5 text-sm font-medium text-cream transition-all hover:scale-[1.01] hover:bg-clay disabled:opacity-70"
                type="submit"
                disabled={isPendingLogin}
              >
                {isPendingLogin ? (
                  <span className="flex items-center justify-center gap-3">
                    <CoreformLiftLoader size="sm" />
                    Đang đăng nhập...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Đăng nhập
                    <ArrowRight className="size-4" />
                  </span>
                )}
              </Button>
            </div>

            <div className="my-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-sand/60" />
              <span className="text-xs uppercase tracking-[0.15em] text-earth/40">Hoặc</span>
              <span className="h-px flex-1 bg-sand/60" />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <GoogleLoginButton />
              <FacebookLoginButton />
            </div>

            <p className="mt-8 text-center text-sm text-earth/60">
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="font-medium text-clay hover:text-earth">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </AuthShell>
  )
}
