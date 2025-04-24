<template>
  <div class="layout">
    <Sidebar v-if="route.path !== '/login'" />
    <main class="main-content">
      <h1 v-if="pageTitle" class="page-title text-4xl font-semibold">{{ pageTitle }}</h1>
      <router-view />
    </main>
  </div>
</template>


<script setup>
import Sidebar from '../components/Sidebar.vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const pageTitle = ref(route.meta.title || '')

watch(() => route.meta.title, (newTitle) => {
  pageTitle.value = newTitle || ''
})
</script>


<style scoped>
.page-title {
  margin-bottom: 50px;
}

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

  .page-title {
    font-size: 1.5rem; /* ประมาณ text-2xl */
  }

  .main-content {
    flex: 1;
    padding-left: 30px;
    padding-right: 30px;
  }
}

@media (min-width: 768px) {
  .layout {
    display: flex;
  }

  .main-content {
    flex: 1;
    padding: 30px;
  }
}
</style>