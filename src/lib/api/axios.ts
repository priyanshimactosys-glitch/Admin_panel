import axios from "axios";

const BASE_URL = import.meta.env.VITE_REACT_BASE_URL || "http://localhost:3009";

export const Axios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(
  (config) => {
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

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);

    if (error?.response?.status === 401) {
      console.log("Unauthorized - token expired");
    }

    return Promise.reject(error);
  }
);