import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAuth } from '@/composables/useAuth'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // แนะนำใช้ env
  withCredentials: false // ปรับเป็น true ถ้าใช้ HttpOnly cookie
})

// ➕ แนบ access token ทุก request
instance.interceptors.request.use((config) => {
  const auth = useAuthStore()
  const token = auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 🔄 Intercept response เพื่อ refresh token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const auth = useAuthStore()

    // ✅ เฉพาะ error 401 (Unauthorized) และยังไม่ retry
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true

      try {
        // ✅ refresh access token
        const { refreshAccessToken } = useAuth()
        const success = await refreshAccessToken()

        if (success) {
          // ✅ แนบ token ใหม่ แล้ว retry request เดิม
          const newToken = auth.accessToken
          error.config.headers.Authorization = `Bearer ${newToken}`
          return instance(error.config)
        } else {
          auth.clearToken()
          window.location.href = '/login' // 👈 redirect ไป login
        }
      } catch (e) {
        auth.clearToken()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default instance
