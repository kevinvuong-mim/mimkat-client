import { TokenStorage } from './token-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Fetch protected data with automatic token refresh
 */
export async function fetchProtectedData(
  endpoint: string,
  options: RequestInit = {}
) {
  const accessToken = TokenStorage.getAccessToken();

  if (!accessToken) {
    // No token, redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
    throw new Error("No access token");
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Token expired, try to refresh
  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry with new token
      return fetchProtectedData(endpoint, options);
    } else {
      // Refresh failed, redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
      throw new Error("Session expired");
    }
  }

  return response;
}

/**
 * Refresh the access token using refresh token from localStorage
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const refreshToken = TokenStorage.getRefreshToken();

    if (!refreshToken) {
      return false;
    }

    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      // Update tokens in localStorage
      TokenStorage.saveTokens(data.accessToken, data.refreshToken);
      return true;
    }

    // Refresh failed, clear tokens
    TokenStorage.clearTokens();
    return false;
  } catch (error) {
    console.error("Error refreshing token:", error);
    TokenStorage.clearTokens();
    return false;
  }
}

/**
 * Logout user by clearing tokens
 */
export async function logout() {
  try {
    const accessToken = TokenStorage.getAccessToken();
    const refreshToken = TokenStorage.getRefreshToken();

    if (accessToken && refreshToken) {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
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

    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return true;
    }

    // If 401, try to refresh token
    if (response.status === 401) {
      return await refreshToken();
    }

    return false;
  } catch {
    return false;
  }
}
