/**
 * Shared application constants
 */

// API Configuration
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Helper function to check if a path is a public route
export const isPublicRoute = (pathname: string): boolean => {
  const PUBLIC_ROUTES = [
    "/forgot-password",
    "/login",
    "/register",
    "/reset-password",
    "/verify-email",
  ];

  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
};
