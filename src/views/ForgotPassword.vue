<template>
  <div class="login-container">
    <form class="login-form">
      <h2 class="mb-4 display-6">Reset Password</h2>
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
      <div class="mb-3">
        <label for="verificationCode" class="form-label"
          >Verification Code</label
        >
        <input
          v-model="verificationCode"
          type="text"
          id="verificationCode"
          class="form-control"
          placeholder="Enter the verification code"
          @input="validateVerificationCode"
        />
        <p class="error-text">{{ verificationCodeError }}</p>
      </div>
      <div class="d-flex align-items-center mb-3">
        <button @click="submitVerificationCode" class="btn btn-primary">
          Submit
        </button>
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
const verificationCode = ref("");
const emailError = ref("");
const verificationCodeError = ref("");

const submitVerificationCode = async () => {
  event.preventDefault();
  validateEmail();
  validateVerificationCode();

  if (emailError.value || verificationCodeError.value) {
    return;
  }
};

const validateEmail = () => {
  emailError.value = formValidations.validateEmail(email.value)
    ? ""
    : "Invalid email format";
};

const validateVerificationCode = () => {
  verificationCodeError.value = formValidations.validateVerificationCode(
    verificationCode.value
  )
    ? ""
    : "Invalid verification code (should be 6 digits)";
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
