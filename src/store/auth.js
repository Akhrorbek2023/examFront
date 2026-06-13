import { create } from "zustand";
import { http } from "../api/http";

const LS_TOKEN = "movies_token";
const LS_USER = "movies_user";

export const authStore = create((set) => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,
  hydrate: () => {
    const token = localStorage.getItem(LS_TOKEN);
    const userRaw = localStorage.getItem(LS_USER);
    set({ token: token || null, user: userRaw ? JSON.parse(userRaw) : null });
  },
  logout: () => {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
    set({ token: null, user: null, error: null });
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await http.post("/api/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem(LS_TOKEN, token);
      localStorage.setItem(LS_USER, JSON.stringify(user));
      set({ token, user, isLoading: false });
    } catch (err) {
      set({ error: err?.response?.data?.message || "Login failed", isLoading: false });
    }
  },
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await http.post("/api/auth/register", { name, email, password });
      const { token, user } = res.data;
      localStorage.setItem(LS_TOKEN, token);
      localStorage.setItem(LS_USER, JSON.stringify(user));
      set({ token, user, isLoading: false });
    } catch (err) {
      set({ error: err?.response?.data?.message || "Register failed", isLoading: false });
    }
  }
}));

