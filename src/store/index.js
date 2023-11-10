import { createStore } from "vuex";

export default createStore({
  state: {
    isLoggedIn: !localStorage.getItem("token") ? false : true,
    token: localStorage.getItem("token") || null,
  },
  mutations: {
    setLoggedIn(state, status) {
      state.isLoggedIn = status;
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
  },
});
