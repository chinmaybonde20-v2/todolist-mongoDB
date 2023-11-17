<template>
  <div class="app-container">
    <GlobalSidebar />
    <div class="content-container">
      <router-view />
    </div>
  </div>
  <GlobalFooter />
</template>

<script setup>
import GlobalFooter from "./components/GlobalFooter.vue";
import GlobalSidebar from "./components/GlobalSidebar.vue";
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.content-container {
  flex: 1;
  padding: 20px;
}

.sidebar {
  width: 15%;
  min-width: 250px;
  background-color: #333;
  color: #fff;
  padding: 20px;
}

.sidebar img {
  max-width: 100%;
}

.header {
  background-color: #333;
  color: #fff;
  padding: 10px;
}

/* Add more styles as needed */
</style>
