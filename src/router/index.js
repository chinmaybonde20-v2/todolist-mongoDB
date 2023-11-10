import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import About from "../views/AboutPage.vue";
import Contact from "../views/ContactPage.vue";
import TodoList from "../views/TodoList.vue";
import AppLogin from "../views/AppLogin.vue";
import AppSignup from "../views/AppSignup.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import { useStore } from "vuex";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/contact", component: Contact },
  { path: "/todo-list", component: TodoList, meta: { requiresAuth: true } },
  { path: "/login", component: AppLogin },
  { path: "/signup", component: AppSignup },
  { path: "/forgot-pass", component: ForgotPassword },
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
