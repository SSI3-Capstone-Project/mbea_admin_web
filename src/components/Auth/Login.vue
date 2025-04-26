<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composable/Auth/useAuth'


const email = ref('')
const password = ref('')
const router = useRouter()

const { login, isLoading, error } = useAuth()

const handleSubmit = async () => {
  const success = await login({ email: email.value, password: password.value })
  if (success) {
    router.push('reports') // เปลี่ยนไปหน้า dashboard หรือหน้าแรก
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">MBEA ADMIN</h2>
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="error" class="text-sm text-red-600 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
