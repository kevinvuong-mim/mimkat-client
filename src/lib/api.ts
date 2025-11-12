import axios from "axios";
import { Token } from "./token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add access token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Token.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Token.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh token API
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { data } = response.data; // API now returns { success, statusCode, message, data: { accessToken, refreshToken } }

        if (!data || !data.accessToken || !data.refreshToken) {
          throw new Error("Invalid refresh token response");
        }

        const { accessToken, refreshToken: newRefreshToken } = data;

        // Save new tokens
        Token.save(accessToken, newRefreshToken);

        // Update authorization header
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process all queued requests with new token
        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        processQueue(refreshError, null);
        Token.clear();

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
