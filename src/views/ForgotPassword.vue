<template>
  <div class="login-container">
    <form class="login-form">
      <h2 class="mb-4 display-6">Forgot Password?</h2>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="email"
          type="text"
          id="email"
          class="form-control"
          placeholder="Enter your email"
          @input="validateEmail"
        />
        <p class="error-text">{{ emailError }}</p>
      </div>

      <div class="d-flex align-items-center mb-3">
        <button class="btn btn-primary">Get reset link</button>

        <p class="forgot-text">
          <router-link to="/login" class="signup-link"
            >Back to Login</router-link
          >
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as formValidations from "@/helpers/validation";

const email = ref("");
const emailError = ref("");

const validateEmail = () => {
  emailError.value = formValidations.validateEmail(email.value)
    ? ""
    : "Invalid email format";
};
</script>

<style scoped>
@import "@/assets/styles/style.scss";
.error-text {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
.forgot-text {
  margin-left: 100px;
  margin-top: 10px;
}
</style>
