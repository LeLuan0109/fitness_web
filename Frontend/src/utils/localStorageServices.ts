const ACCESS_TOKEN = "access_token"
const REFRESH_TOKEN = "refresh_token"

// Access Token
const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN)
}

const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN, token)
}

const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN)
}

// Refresh Token
const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN)
}

const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN, token)
}

const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN)
}

export const localStorageServices = {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
}
