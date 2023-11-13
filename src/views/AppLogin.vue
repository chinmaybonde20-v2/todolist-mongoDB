<template>
  <div class="login-container">
    <form class="login-form" v-if="!showOTP">
      <h2 class="text-center mb-4 display-6">Login</h2>
      <br />
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
          placeholder="Enter your password"
          @input="validatePassword"
        />
        <p class="error-text">{{ passwordError }}</p>
      </div>
      <div class="d-flex align-items-center mb-3">
        <button @click="login" class="btn btn-primary">Login</button>
        <p class="forgot-text">
          <router-link to="/forgot-pass" class="signup-link"
            >Forgot password ?</router-link
          >
        </p>
      </div>
      <p class="mt-3">
        If not a user,
        <router-link to="/signup" class="signup-link"
          >click here to sign up</router-link
        >
      </p>
    </form>

    <!-- Verify QR and OTP -->
    <div class="signup-form" v-else>
      <h2 class="text-center mb-4 display-6">Verify OTP</h2>
      <div class="mb-3">
        <label for="token" class="form-label">Authenticator Code</label>
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import * as formValidations from "@/helpers/validation";

const router = useRouter();
const store = useStore();
const email = ref("");
const password = ref("");
const loginMessage = ref("");
const jwtToken = ref(localStorage.getItem("token") || "");
const showOTP = ref(false);
const loginQRCode = ref("");
const mfaOTP = ref("");

const emailError = ref("");
const passwordError = ref("");

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

const login = async () => {
  event.preventDefault();

  validateEmail();
  validatePassword();

  if (emailError.value || passwordError.value) {
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    if (response.ok) {
      const data = await response.json();
      // jwtToken.value = data.jwtFToken;
      loginQRCode.value = data.qrCodeUrl;
      showOTP.value = true;
      // store.commit("setToken", jwtToken.value);
      // localStorage.setItem("token", jwtToken.value);
    } else {
      const data = await response.json();
      loginMessage.value = data.error || "Login failed";
      alert(loginMessage.value);
    }
  } catch (error) {
    loginMessage.value = "Login failed";
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
      const data = await response.json();
      jwtToken.value = data.jwtToken;
      store.commit("setLoggedIn", true);
      store.commit("setToken", data.jwtToken);
      localStorage.setItem("token", jwtToken.value);

      alert("Logged in successfully!");
      router.push("/emp-manager");
    } else {
      const data = await response.json();
      loginMessage.value = data.error || "Login failed";
    }
  } catch (error) {
    loginMessage.value = "Login failed";
  }
};
</script>

<style scoped>
@import "@/assets/styles/style.scss";

.forgot-text {
  margin-left: 100px;
  margin-top: 10px;
}
</style>
