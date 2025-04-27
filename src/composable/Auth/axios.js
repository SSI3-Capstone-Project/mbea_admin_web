import axios from 'axios'
import { useAuthStore } from './useAuthStore'
import { refreshAccessToken } from './tokenService'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // แนะนำใช้ env
  withCredentials: true // ปรับเป็น true ถ้าใช้ HttpOnly cookie
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
  res => res,
  async error => {
    const auth = useAuthStore()

    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true

      const success = await refreshAccessToken()

      if (success) {
        error.config.headers.Authorization = `Bearer ${auth.accessToken}`
        return instance(error.config)
      } else {
        if (window.location.pathname !== '/ssi3/login') {
          // auth.clearToken()
          // window.location.href = '/ssi3/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default instance
