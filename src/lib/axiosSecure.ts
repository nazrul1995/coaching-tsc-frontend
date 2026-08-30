// frontend/src/axiosSecure.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : "https://backend-rho-two-53.vercel.app/api/v1";

const axiosSecure = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosSecure.interceptors.request.use(
  (config) => {
    // LocalStorage থেকে টোকেন নিয়ে Authorization হেডারে সেট করা
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized request");
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;