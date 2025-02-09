import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("authToken") || null,
    role: null,
  }),
  actions: {
    setToken(token, role) {
      this.token = token;
      this.role = role;
      localStorage.setItem("authToken", token);
    },
    logout() {
      this.token = null;
      this.role = null;
      localStorage.removeItem("authToken");
    },
  },
});
