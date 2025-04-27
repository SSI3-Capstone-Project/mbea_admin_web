import axios from './axios'
import { useAuthStore } from './useAuthStore'

export async function refreshAccessToken() {
  const auth = useAuthStore()
  const refreshToken = document.cookie
    .match(/(^|;) ?refresh_token=([^;]*)(;|$)/)?.[2]

  console.log('[refreshAccessToken] refreshToken:', refreshToken)

  if (!refreshToken) {
    console.warn('[refreshAccessToken] No refresh token found in cookie')
    auth.clearToken()
    return false
  }

  try {
    const res = await axios.post('/api/operator/refresh-token', {
      refresh_token: decodeURIComponent(refreshToken)
    })

    console.log('[refreshAccessToken] refresh response:', res.data)

    const { access_token, refresh_token: newRefresh } = res.data.data
    auth.setToken(access_token)

    document.cookie =
      `refresh_token=${encodeURIComponent(newRefresh)}; path=/; max-age=604800; SameSite=Strict`
    console.log('[refreshAccessToken] Set new refresh token in cookie')

    return true
  } catch (e) {
    console.error('[refreshAccessToken] Failed to refresh token:', e.response?.data || e.message)
    console.log('[refreshAccessToken] Failed to refresh token:', e);
    
    auth.clearToken()
    return false
  }
}
