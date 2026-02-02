import axios from "axios";
import Cookies from "js-cookie";

// const baseURL = "import.meta.env.VITE_API_URL" || "";
const baseURL = "";

export const axiosInstance = axios.create({
  baseURL,
  headers: { Accept: "application/json" },
  // withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
