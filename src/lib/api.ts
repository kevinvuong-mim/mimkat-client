import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { TokenStorage } from "./token-storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// State để quản lý refresh token process
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process queue of failed requests after token refresh
 */
const processQueue = (
  error: Error | null = null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

/**
 * Refresh the access token using refresh token from localStorage
 */
async function refreshToken(): Promise<string | null> {
  try {
    const refreshToken = TokenStorage.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Update tokens in localStorage
    TokenStorage.saveTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    TokenStorage.clearTokens();
    return null;
  }
}

/**
 * Create axios instance with auto token refresh
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor - Thêm access token vào header
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = TokenStorage.getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Auto refresh token khi 401
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Đang refresh token, queue request này
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          // Process all queued requests
          processQueue(null, newAccessToken);

          // Retry original request với token mới
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          // Refresh failed
          processQueue(new Error("Session expired"), null);

          // Redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/auth";
          }

          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err as Error, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
/**
 * Logout user by clearing tokens
 */
export async function logout() {
  try {
    const accessToken = TokenStorage.getAccessToken();
    const refreshTokenValue = TokenStorage.getRefreshToken();

    if (accessToken && refreshTokenValue) {
      await apiClient.post("/auth/logout", {
        refreshToken: refreshTokenValue,
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear tokens from localStorage
    TokenStorage.clearTokens();

    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
  }
}

/**
 * Check if user is authenticated (has valid tokens)
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const accessToken = TokenStorage.getAccessToken();

    if (!accessToken) {
      return false;
    }

    const response = await apiClient.get("/auth/me");
    return response.status === 200;
  } catch (error) {
    // If error (including 401), auto refresh will handle it
    // If refresh fails, user will be redirected
    return false;
  }
}
