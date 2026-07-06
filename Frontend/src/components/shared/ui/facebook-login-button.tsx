import { FACEBOOK_APP_ID } from "@/constants/api"
import { useLoginWithFacebook } from "@/hooks/queries/auth/useAuthQuery"
import transitionStore from "@/stores/transition.store"
import { localStorageServices } from "@/utils/localStorageServices"
import ReactFacebookLogin from "react-facebook-login"

export function FacebookLoginButton() {
  const { mutate: loginWithFacebook } = useLoginWithFacebook({
    config: {
      onSuccess: (data) => {
        localStorageServices.setAccessToken(data.data?.accessToken ?? "")
        localStorageServices.setRefreshToken(data.data?.refreshToken ?? "")
        transitionStore.getState().playEnter(() => {
          window.location.href = "/"
        })
      },
      onError: (error) => {
        console.error("Facebook login failed:", error)
      },
    },
  })

  const responseFacebook = (response) => {
    // Nếu lấy được accessToken thì gửi lên Server Spring Boot
    if (response.accessToken) {
      loginWithFacebook({ accessToken: response.accessToken })
    } else {
      console.error("Không lấy được Access Token")
    }
  }

  return (
    <ReactFacebookLogin
      appId={FACEBOOK_APP_ID}
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
      cssClass="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-sand/60 bg-white px-4 text-sm font-medium text-earth transition-all hover:border-clay hover:bg-cream"
      icon={
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      }
      typeButton="button"
      textButton="Facebook"
    />
  )
}
