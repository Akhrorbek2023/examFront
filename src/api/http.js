import axios from "axios";
import { authStore } from "../store/auth";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

http.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});
