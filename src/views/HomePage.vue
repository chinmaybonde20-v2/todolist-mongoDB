<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="text-center">
          <h1 class="display-4">Welcome to the Home Page</h1>
          <hr />
          <h1 class="display-5" v-if="store.state.isLoggedIn">
            Logged in successfully
          </h1>
          <h1 class="display-5" v-else>Please login first</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";

const store = useStore();
</script>
