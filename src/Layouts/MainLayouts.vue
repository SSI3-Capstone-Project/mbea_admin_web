<template>
    <div class="layout">
      <Sidebar />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </template>
  
  <script setup>
  import Sidebar from '../components/Sidebar.vue'
  </script>
  
  <style scoped>
  .layout {
    display: flex;
  }
  .main-content {
    flex: 1;
    padding: 31px;
  }
  </style>
  