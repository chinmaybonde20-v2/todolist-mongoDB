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
        <p @click="showLogoutModal" class="nav-link">Logout</p>
      </span>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-content">
          <h4 class="modal-title">Are you sure you want to logout?</h4>
          <div class="button-container">
            <button class="confirm-button" @click="confirmLogout">Yes</button>
            <button class="cancel-button" @click="cancelLogout">No</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const router = useRouter();

const store = useStore();
const isLoggedIn = computed(() => store.state.isLoggedIn);
const showModal = ref(false);

const showLogoutModal = () => {
  showModal.value = true;
};

const confirmLogout = async () => {
  store.commit("setLoggedIn", false);
  store.commit("setToken", null);
  localStorage.removeItem("token");
  router.push("/");
  showModal.value = false;
};

const cancelLogout = () => {
  showModal.value = false;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  z-index: 1000;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 5px;
}

.modal-title {
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.confirm-button,
.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-button {
  background-color: #4caf50;
  color: white;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}
</style>
