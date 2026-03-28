import axios from "axios";

const axiosSecure = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log('Attaching token to request:', token); // Debugging log
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosSecure;