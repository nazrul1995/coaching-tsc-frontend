import axios from "axios";

const axiosSecure = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
axiosSecure.interceptors.request.use(
  (config) => {
    // JWT is stored in HttpOnly cookie.
    // Browser automatically sends the cookie.
    console.log("Sending request:", config.method?.toUpperCase(), config.url);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosSecure.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized request");
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;