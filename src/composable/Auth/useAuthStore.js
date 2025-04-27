import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)

  function setToken(access, refresh = null) {
    accessToken.value = access
    localStorage.setItem('accessToken', access)
    if (refresh !== null) {
      refreshToken.value = refresh
      localStorage.setItem('refreshToken', refresh)
    }
  }

  function clearToken() {
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
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
    refreshToken,
    setToken,
    clearToken,
    getAuthHeader,
    isLoggedIn
  }
})
