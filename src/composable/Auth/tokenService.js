import axios from './axios'
import { useAuthStore } from './useAuthStore'

export async function refreshAccessToken() {
  const auth = useAuthStore()
  const refreshToken = document.cookie
    .match(/(^|;) ?refresh_token=([^;]*)(;|$)/)?.[2]

  if (!refreshToken) {
    auth.clearToken()
    return false
  }

  try {
    const res = await axios.post('/api/operator/refresh-token', {
      refresh_token: decodeURIComponent(refreshToken)
    })

    const { access_token, refresh_token: newRefresh } = res.data.data
    auth.setToken(access_token)

    document.cookie =
      `refresh_token=${encodeURIComponent(newRefresh)}; path=/; max-age=604800; SameSite=Strict`

    return true
  } catch (e) {
    auth.clearToken()
    return false
  }
}
