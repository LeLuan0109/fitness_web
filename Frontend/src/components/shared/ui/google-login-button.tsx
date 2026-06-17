import { Button } from "@/components/shared/ui/button"
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@/constants/api"
import { useLoginWithGoogle } from "@/hooks/queries/auth/useAuthQuery"
import { localStorageServices } from "@/utils/localStorageServices"
import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { toast } from "sonner"

export function GoogleLoginButton() {
  const { mutate: mutateGoogleLogin, isPending } = useLoginWithGoogle({
    config: {
      onSuccess: (data) => {
        localStorageServices.setAccessToken(data.data?.accessToken ?? "")
        localStorageServices.setRefreshToken(data.data?.refreshToken ?? "")
        window.location.href = "/"
      },
      onError: (error) => {
        toast.error(error.response?.data?.error.message || "Đăng nhập Google thất bại.")
      },
    },
  })

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const tokenResponse = await axios.post(
          "https://oauth2.googleapis.com/token",
          new URLSearchParams({
            code: codeResponse.code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: "http://localhost:5173",
            grant_type: "authorization_code",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        )

        const tokens = tokenResponse.data
        mutateGoogleLogin({ tokenId: tokens.id_token })
      } catch (error) {
        console.error("Google OAuth error:", error)
        toast.error("Đăng nhập Google thất bại.")
      }
    },
    onError: () => {
      toast.error("Đăng nhập Google thất bại.")
    },
    flow: "auth-code",
  })

  return (
    <Button
      variant="outline"
      className="flex-1 bg-red-600/80 hover:bg-red-600 border-red-500 text-white"
      onClick={() => {
        googleLogin()
      }}
      type="button"
      disabled={isPending}
    >
      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      {isPending ? "Đang đăng nhập..." : "Google"}
    </Button>
  )
}
