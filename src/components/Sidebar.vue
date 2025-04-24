<template>
    <div>
        <!-- Hamburger Button -->
        <button class="hamburger" @click="toggleSidebar">
            ☰
        </button>

        <!-- Sidebar -->
        <div class="sidebar" :class="{ open: isOpen }">
            <!-- Close Button (เฉพาะบนมือถือ) -->
            <button class="close-btn md:hidden mb-10" @click="closeSidebar">✕</button>

            <div class="top-menu mt-10 md:mt-0">
                <nav>
                    <router-link to="/reports" @click="closeSidebar" :class="{ 'router-link-active': route.path.startsWith('/reports') }">Reports</router-link>
                    <router-link to="/brands" @click="closeSidebar" :class="{ 'router-link-active': route.path.startsWith('/brands') }">Brands</router-link>
                    <router-link to="/collections" @click="closeSidebar" :class="{ 'router-link-active': route.path.startsWith('/collections') }">Collections</router-link>
                    <router-link to="/subcollections" @click="closeSidebar" :class="{ 'router-link-active': route.path.startsWith('/subcollections') }">Subcollections</router-link>
                </nav>
            </div>

            <div class="bottom-menu">
                <nav>
                    <router-link to="/login" @click="exit">Logout</router-link>
                </nav>
            </div>
        </div>

        <!-- Overlay -->
        <div v-if="isOpen" class="overlay" @click="closeSidebar"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composable/Auth/useAuth'
import { useRoute } from 'vue-router'

const route = useRoute()

const { logout } = useAuth()

const isOpen = ref(false)

function toggleSidebar() {
    isOpen.value = !isOpen.value
}

function closeSidebar() {
    isOpen.value = false
}

function exit() {
    isOpen.value = false
    logout()
}
</script>

<style scoped>
/* Hamburger Button */
.hamburger {
    display: none;
    font-size: 30px;
    background: none;
    border: none;
    margin: 10px;
    cursor: pointer;
    z-index: 1100;
}

/* Sidebar */
.sidebar {
    position: fixed; /* เดิมเป็น fixed แล้ว ใช้ต่อได้เลย */
    top: 0;
    left: 0;
    width: 240px;
    height: 100vh;
    background-color: #ffffff;
    padding: 20px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
}

/* Menu Blocks */
.top-menu nav,
.bottom-menu nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.bottom-menu nav {
    background-color: var(--color-primary);
    border-radius: 8px;
    color: #007acc;
    font-weight: 600;
}

.sidebar.open {
    transform: translateX(0);
}

.sidebar a {
    display: block;
    text-decoration: none;
    color: #333;
    font-size: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.sidebar a:hover {
    background-color: #f0f8ff;
    color: #007acc;
}

/* Active Link */
.router-link-active {
    background-color: var(--color-primary);
    color: #007acc;
    font-weight: 600;
}

/* Overlay */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 500;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

.sidebar a:active,
.sidebar a:focus {
    color: #007acc;
    background-color: var(--color-primary);
}

/* Responsive */
@media (min-width: 768px) {
    .hamburger {
        display: none;
    }

    .sidebar {
        transform: translateX(0);
        position:sticky;
        height: 100vh;
    }

    .overlay {
        display: none;
    }
}

@media (max-width: 767px) {
    .hamburger {
        display: block;
    }

    .sidebar {
        height: 100%;
    }
}
</style>