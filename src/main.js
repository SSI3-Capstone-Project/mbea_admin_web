import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)     // 🟢 ต้องใส่ก่อนใช้งาน store
app.use(router)
app.mount('#app')
