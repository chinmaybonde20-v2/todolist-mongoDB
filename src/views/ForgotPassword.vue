<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="submitVerificationCode">
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
        <button type="submit" class="btn btn-primary">Get reset link</button>
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
import { useRouter } from "vue-router";

const email = ref("");
const emailError = ref("");
const router = useRouter();

const submitVerificationCode = async () => {
  validateEmail();

  if (emailError.value) {
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      alert("Reset link sent to your email");
      router.push("/reset-pass");
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const validateEmail = () => {
  emailError.value = formValidations.validateEmail(email.value)
    ? ""
    : "Invalid email format";
};
</script>

<style scoped>
/* Styles */
</style>
