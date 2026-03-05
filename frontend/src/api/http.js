import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

export const http = axios.create({ baseURL });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("vam_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
