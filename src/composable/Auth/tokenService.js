import axios from './axios'
import { useAuthStore } from './useAuthStore'

export async function refreshAccessToken() {
  const auth = useAuthStore()
  const refreshToken = auth.refreshToken // ✅ ดึงจาก store

  console.log('[refreshAccessToken] refreshToken:', refreshToken)

  if (!refreshToken) {
    console.warn('[refreshAccessToken] No refresh token found')
    auth.clearToken()
    return false
  }

  try {
    const res = await axios.post('/api/operator/refresh-token', {
      refresh_token: refreshToken,
    })

    console.log('[refreshAccessToken] refresh response:', res.data)

    const { access_token, refresh_token: newRefresh } = res.data.data
    auth.setToken(access_token, newRefresh) // ✅ เซตคู่ใหม่

    console.log('[refreshAccessToken] Set new refresh token')
    return true
  } catch (e) {
    console.error('[refreshAccessToken] Failed to refresh token:', e.response?.data || e.message)
    auth.clearToken()
    return false
  }
}
