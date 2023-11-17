<template>
  <div class="login-container">
    <form class="signup-form" v-if="!showOTPForm">
      <h2 class="text-center mb-4 display-6">Signup</h2>
      <br />
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          v-model="name"
          type="text"
          id="name"
          class="form-control"
          placeholder="Enter your name"
          @input="validateName"
        />
        <p class="error-text">{{ nameError }}</p>
      </div>
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
        <label for="password" class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          class="form-control"
          placeholder="Enter password"
          @input="validatePassword"
        />
        <p class="error-text">{{ passwordError }}</p>
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          id="confirmPassword"
          class="form-control"
          placeholder="Confirm your password"
          @input="validateConfirmPassword"
        />
        <p class="error-text">{{ confirmPasswordError }}</p>
      </div>
      <div class="mb-3">
        <label for="country" class="form-label">Country</label>
        <select
          v-model="country"
          id="country"
          class="form-select"
          @change="validateCountry"
        >
          <option value="" disabled>Select country</option>
          <option value="india">India</option>
          <option value="us">United States</option>
        </select>
        <p class="error-text">{{ countryError }}</p>
      </div>
      <button @click="signup" class="btn btn-primary">Signup</button>
      <p class="mt-3">
        If you already have an account,
        <router-link to="/login" class="signup-link"
          >click here to login</router-link
        >
      </p>
    </form>
    <!-- QR Code -->
    <div class="signup-form" v-else>
      <h2 class="text-center mb-4 display-6">Verify OTP</h2>
      <div class="text-center mb-4">
        <img :src="qrCode" alt="QR Code" />
      </div>
      <div class="mb-3">
        <input
          v-model="mfaOTP"
          type="text"
          id="token"
          class="form-control"
          placeholder="Enter your authenticator code"
        />
      </div>
      <button @click="verify" class="btn btn-primary">Verify</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as formValidations from "@/helpers/validation";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const country = ref("");
const nameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const countryError = ref("");
const showOTPForm = ref(false);
const mfaOTP = ref("");
const qrCode = ref("");

const signup = async () => {
  event.preventDefault();
  validation();

  if (hasValidationErrors()) {
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        country: country.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      qrCode.value = data.qrCodeUrl;
      showOTPForm.value = true;
    } else {
      console.error("Error signing up:", response.statusText);
    }
  } catch (error) {
    console.error("Error signing up:", error);
  }
};

const verify = async () => {
  try {
    const response = await fetch("http://localhost:3000/mfa-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        mfaToken: mfaOTP.value,
      }),
    });

    if (response.ok) {
      alert("Successfully verified");
      router.push("/login");
    } else {
      console.error("Error verifying:", response.statusText);
    }
  } catch (error) {
    console.error("Error verifying:", error);
  }
};
const validateName = () => {
  nameError.value = formValidations.validateName(name.value)
    ? ""
    : "Name is required and should contain only letters";
};

const validateEmail = () => {
  emailError.value = formValidations.validateEmail(email.value)
    ? ""
    : "Invalid email format";
};

const validatePassword = () => {
  passwordError.value = formValidations.validatePassword(password.value)
    ? ""
    : "Password must be between 8 and 15 characters";
};

const validateConfirmPassword = () => {
  confirmPasswordError.value =
    password.value === confirmPassword.value ? "" : "Passwords do not match";
};

const validateCountry = () => {
  countryError.value = country.value === "" ? "Please select a country" : "";
};

const validation = () => {
  validateName();
  validateEmail();
  validatePassword();
  validateConfirmPassword();
  validateCountry();
};

const hasValidationErrors = () => {
  return (
    nameError.value ||
    emailError.value ||
    passwordError.value ||
    confirmPasswordError.value ||
    countryError.value
  );
};
</script>

<style scoped>
@import "@/assets/styles/style.scss";

.error-text {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
