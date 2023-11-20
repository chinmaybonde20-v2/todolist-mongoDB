<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="resetPassword">
      <h2 class="mb-4 display-6">Reset Password</h2>
      <div class="mb-3">
        <label for="otp" class="form-label">Enter OTP</label>
        <input
          v-model="otp"
          type="text"
          id="otp"
          class="form-control"
          placeholder="Enter OTP"
          @input="validateOTP"
        />
        <p class="error-text">{{ otpError }}</p>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">New Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          class="form-control"
          placeholder="Enter new password"
          @input="validatePassword"
        />
        <p class="error-text">{{ passwordError }}</p>
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label"
          >Confirm New Password</label
        >
        <input
          v-model="confirmPassword"
          type="password"
          id="confirmPassword"
          class="form-control"
          placeholder="Confirm new password"
          @input="validateConfirmPassword"
        />
        <p class="error-text">{{ confirmPasswordError }}</p>
      </div>
      <button type="submit" class="btn btn-primary">Reset Password</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as formValidations from "@/helpers/validation";

const router = useRouter();

const otp = ref("");
const password = ref("");
const confirmPassword = ref("");
const otpError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");

const resetPassword = async () => {
  event.preventDefault();
  validateInputs();

  if (hasValidationErrors()) {
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      }),
    });

    if (response.ok) {
      alert("Password reset successfully");
      router.push("/login");
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const validateInputs = () => {
  validateOTP();
  validatePassword();
  validateConfirmPassword();
};

const validateOTP = () => {
  otpError.value = formValidations.validateOTP(otp.value)
    ? ""
    : "Invalid OTP format";
};

const validatePassword = () => {
  passwordError.value = formValidations.validatePassword(password.value)
    ? ""
    : "Password must be between 8 and 20 characters";
};

const validateConfirmPassword = () => {
  confirmPasswordError.value = formValidations.validateConfirmPassword(
    password.value,
    confirmPassword.value
  )
    ? ""
    : "Passwords do not match";
};

const hasValidationErrors = () => {
  return otpError.value || passwordError.value || confirmPasswordError.value;
};
</script>

<style scoped>
/* Styles */
.login-container {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.error-text {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
