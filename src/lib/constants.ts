// API Configuration
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// List of public routes that do not require authentication
export const PUBLIC_ROUTES = [
  "/forgot-password",
  "/login",
  "/register",
  "/reset-password",
  "/verify-email",
];
