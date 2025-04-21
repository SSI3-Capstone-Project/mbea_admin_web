import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)

  function setToken(token) {
    accessToken.value = token
  }

  function clearToken() {
    accessToken.value = null
    document.cookie = 'refresh_token=; Max-Age=0' // ลบ refresh token ด้วย
  }

  function getAuthHeader() {
    return accessToken.value
      ? { Authorization: `Bearer ${accessToken.value}` }
      : {}
  }

  function isLoggedIn() {
    return !!accessToken.value
  }
  
  return {
    accessToken,
    setToken,
    clearToken,
    getAuthHeader,
    isLoggedIn
  }
  
})
