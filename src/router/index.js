import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import About from "../views/AboutPage.vue";
import Contact from "../views/ContactPage.vue";
import EmployeeManager from "../views/EmployeeManager.vue";
import AppLogin from "../views/AppLogin.vue";
import AppSignup from "../views/AppSignup.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "@/views/ResetPassword.vue";

import { useStore } from "vuex";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/contact", component: Contact },
  {
    path: "/emp-manager",
    component: EmployeeManager,
    meta: { requiresAuth: true },
  },
  { path: "/login", component: AppLogin },
  { path: "/signup", component: AppSignup },
  { path: "/forgot-pass", component: ForgotPassword },
  { path: "/reset-pass", component: ResetPassword },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.state.isLoggedIn) {
      next();
    } else {
      alert("Please login first");
      next("/login");
    }
  } else {
    next();
  }
});
export default router;
