<template>
    <div class="sidebar">
      <router-link to="/brands">Brands</router-link>
      <router-link to="/collections">Collections</router-link>
      <router-link to="/subcollections">SubCollections</router-link>
    </div>
  </template>
  
  <script setup>
  // ไม่ต้องมีอะไรพิเศษ
  </script>
  
  <style scoped>
  .sidebar {
    width: 200px;
    background-color: #f2f2f2;
    padding: 20px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .router-link-active {
    font-weight: bold;
    color: #42b983;
  }
  </style>
  