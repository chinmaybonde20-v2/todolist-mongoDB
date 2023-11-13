<template>
  <div class="sidebar">
    <router-link to="/">
      <img src="https://www.v2solutions.com/images/v-2-logo.svg" alt="Logo" />
    </router-link>
    <hr />
    <div class="nav-links">
      <p><router-link to="/" class="nav-link">Home</router-link></p>
      <p>
        <router-link to="/emp-manager" class="nav-link">Employees</router-link>
      </p>
      <span v-if="!isLoggedIn">
        <p><router-link to="/login" class="nav-link">Login</router-link></p>
      </span>
      <span v-else>
        <p @click="logout" class="nav-link">Logout</p>
      </span>
    </div>
  </div>
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

<style scoped>
.sidebar {
  width: 15%;
  background-color: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
}

.sidebar img {
  margin-bottom: 20px;
  cursor: pointer;
  height: 40px;
}

.nav-links {
  margin-top: 40px;
}

.nav-link {
  display: block;
  color: gray;
  margin-bottom: 10px;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
  font-size: 20px;
}

.nav-link:hover {
  color: #fff;
}
</style>
