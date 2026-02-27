<template>
  <router-view />
  <Sidebar />
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
</script>

<style>
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
}

#app {
  min-height: 100vh;
  width: 100%;
}

body {
  background: #f4f6f5;
}
</style>