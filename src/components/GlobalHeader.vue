<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link to="/contact" class="nav-link">Contact Us</router-link>
        <router-link to="/todo-list" class="nav-link">Todo-List</router-link>
      </div>
      <div v-if="!isLoggedIn">
        <router-link to="/login" class="btn btn-login">Login</router-link>
      </div>
      <div v-else>
        <button @click="logout" class="btn btn-logout">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const router = useRouter();

const store = useStore();
const isLoggedIn = computed(() => store.state.isLoggedIn);

const logout = async () => {
  store.commit("setLoggedIn", false);
  store.commit("setToken", null);
  localStorage.removeItem("token");
  router.push("/");
};
</script>
<style lang="scss" scoped>
.navbar {
  background-color: #3498db;
  color: white;
  padding: 10px 0;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  font-size: 18px;
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #2980b9;
}

.btn-login,
.btn-logout {
  background-color: #ddd8d8;
  color: rgb(0, 0, 0);
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
}

.btn-login:hover {
  background-color: #9c9c9c;
}
</style>
