import axios from "axios";
import { API_URL, isPublicRoute } from "@/lib/constants";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for CORS requests
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, status: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(status);
    }
  });
  failedQueue = [];
};

// Response interceptor - Auto refresh token on 401
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token API - cookies will be sent automatically
        await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true, // Important for cookie-based auth
          }
        );

        // If refresh is successful, new tokens are stored in cookies automatically
        // Process all queued requests
        processQueue(null, "success");

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        processQueue(refreshError, null);

        // Redirect to login page only if not already on auth pages
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;

          if (!isPublicRoute(currentPath)) {
            window.location.href = "/login";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
