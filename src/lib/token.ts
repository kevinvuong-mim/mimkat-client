const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Helper to set cookie
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Helper to delete cookie
function deleteCookie(name: string) {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
}

export const Token = {
  save(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;

    // Save to localStorage
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    // Save to cookies for middleware
    setCookie("accessToken", accessToken);
    setCookie("refreshToken", refreshToken);
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  clear(): void {
    if (typeof window === "undefined") return;

    // Clear from localStorage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    // Clear from cookies
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
  },
};
