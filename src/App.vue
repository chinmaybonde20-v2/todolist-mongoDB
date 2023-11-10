<template>
  <div class="app-container">
    <GlobalHeader />
    <router-view />
    <GlobalFooter />
  </div>
</template>
<script setup>
import GlobalHeader from "./components/GlobalHeader.vue";
import GlobalFooter from "./components/GlobalFooter.vue";
</script>
<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

Header {
  background-color: #333;
  color: #fff;
  padding: 10px;
}

Footer {
  background-color: #333;
  color: #fff;
  padding: 10px;
  margin-top: auto; /* Push the footer to the bottom */
}
</style>
