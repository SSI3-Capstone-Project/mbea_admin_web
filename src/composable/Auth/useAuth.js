import axios from './axios'
import { ref } from 'vue'
import { useAuthStore } from './useAuthStore'

function getRefreshTokenFromCookie() {
  const match = document.cookie.match(/(^|;) ?refresh_token=([^;]*)(;|$)/)
  return match ? decodeURIComponent(match[2]) : null
}

export function useAuth() {
  const isLoading = ref(false)
  const error = ref(null)
  const auth = useAuthStore()
  const isProd = import.meta.env.PROD

  // ✅ ฟังก์ชันช่วยเซต cookie
  function setRefreshTokenCookie(token) {
    document.cookie =
      `refresh_token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}` +
      (isProd ? '; Secure; SameSite=Strict' : '')
  }

  const login = async ({ email, password }) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await axios.post('/api/operator/login', { email, password })
      const { access_token, refresh_token } = res.data.data
      auth.setToken(access_token)
      setRefreshTokenCookie(refresh_token)
      return true
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Login failed'
      console.log(error.value);   
      return false
    } finally {
      isLoading.value = false
    }
  }

  const refreshAccessToken = async () => {
    const refreshToken = getRefreshTokenFromCookie()
    if (!refreshToken) {
      auth.clearToken()
      return false
    }

    try {
      const res = await axios.post('/api/operator/refresh-token', {
        refresh_token: refreshToken
      })
      const { access_token, refresh_token: newRefresh } = res.data.data
      auth.setToken(access_token)
      setRefreshTokenCookie(newRefresh)
      return true
    } catch (e) {
      auth.clearToken()
      return false
    }
  }

  const logout = () => {
    auth.clearToken()
    console.log('Logged out', auth.accessToken)
  }

  return {
    login,
    refreshAccessToken,
    logout,
    isLoading,
    error
  }
}
