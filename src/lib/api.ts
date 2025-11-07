const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Fetch protected data with automatic token refresh
 */
export async function fetchProtectedData(
  endpoint: string,
  options: RequestInit = {}
) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
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
 * Refresh the access token using refresh token
 */
export async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return true;
    } else {
      // Refresh failed, clear tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

/**
 * Logout user by clearing tokens
 */
export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  if (typeof window !== "undefined") {
    window.location.href = "/auth";
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("accessToken");
}
