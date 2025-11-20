import { PUBLIC_ROUTES } from "./constants";

// Helper function to check if a path is a public route
export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
};
