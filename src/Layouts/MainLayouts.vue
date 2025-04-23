<template>
  <div class="layout">
    <Sidebar v-if="route.path !== '/login'" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>


<script setup>
import Sidebar from '../components/Sidebar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>


<style scoped>
@media (min-width: 768px) {
  .layout {
    display: flex;
  }

  .main-content {
    flex: 1;
    padding: 30px;
  }
}

@media (max-width: 767px) {

  .main-content {
    flex: 1;
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>