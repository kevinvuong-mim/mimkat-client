const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

let csrfToken: string | null = null;

/**
 * Fetch CSRF token from server
 */
async function fetchCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;

  const response = await fetch(`${API_URL}/api/v1/auth/csrf-token`, {
    credentials: 'include', // Important for cookies
  });

  if (response.ok) {
    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken;
  }

  throw new Error('Failed to fetch CSRF token');
}

/**
 * Fetch protected data with automatic token refresh and CSRF protection
 */
export async function fetchProtectedData(
  endpoint: string,
  options: RequestInit = {}
) {
  // Get CSRF token for state-changing methods
  const needsCsrf = !['GET', 'HEAD', 'OPTIONS'].includes(
    options.method?.toUpperCase() || 'GET'
  );

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Client-Type': 'web',
    ...(options.headers as Record<string, string>),
  };

  if (needsCsrf) {
    const token = await fetchCsrfToken();
    headers['X-CSRF-Token'] = token;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Critical: send cookies
  });

  // Token expired, try to refresh
  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry with new token (in cookie)
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
 * Refresh the access token using refresh token (in cookie)
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'web',
      },
      credentials: 'include', // Send refresh token cookie
      body: JSON.stringify({}), // Empty body for web clients
    });

    return response.ok;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

/**
 * Logout user by clearing cookies on server
 */
export async function logout() {
  try {
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'web',
      },
      credentials: 'include',
      body: JSON.stringify({}),
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear any local state and redirect
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
  }
}

/**
 * Check if user is authenticated (check for cookie existence via API call)
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      credentials: 'include',
      headers: {
        'X-Client-Type': 'web',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
