/**
 * API Client with Auto Token Refresh using Axios
 * Wrapper around axios instance with interceptors
 */
import { apiClient as axiosInstance } from "./api";
import { AxiosRequestConfig } from "axios";

class ApiClient {
  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.get<T>(endpoint, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.post<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.put<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.patch<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.delete<T>(endpoint, config);
    return response.data;
  }

  /**
   * Public GET request (no auth required)
   * Uses axios directly without interceptors
   */
  async publicGet<T = unknown>(endpoint: string): Promise<T> {
    const response = await axiosInstance.get<T>(endpoint, {
      headers: {
        Authorization: undefined, // Remove auth header
      },
    });
    return response.data;
  }

  /**
   * Public POST request (no auth required)
   * Uses axios directly without interceptors
   */
  async publicPost<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    const response = await axiosInstance.post<T>(endpoint, data, {
      headers: {
        Authorization: undefined, // Remove auth header
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
