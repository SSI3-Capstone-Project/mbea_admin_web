import axios from './axios'
import { ref } from 'vue'
import { useAuthStore } from './useAuthStore'

export function useAuth() {
  const isLoading = ref(false)
  const error = ref(null)
  const auth = useAuthStore()

  const login = async ({ email, password }) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await axios.post('/api/operator/login', { email, password })
      const { access_token, refresh_token } = res.data.data
      auth.setToken(access_token, refresh_token) // ✅ เก็บ access + refresh
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
    const refreshToken = auth.refreshToken
    if (!refreshToken) {
      auth.clearToken()
      return false
    }

    try {
      const res = await axios.post('/api/operator/refresh-token', {
        refresh_token: refreshToken,
      })
      const { access_token, refresh_token: newRefresh } = res.data.data
      auth.setToken(access_token, newRefresh) // ✅ เซตใหม่ทั้งคู่
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
