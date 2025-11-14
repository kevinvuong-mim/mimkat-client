import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication (using new structure)
const protectedRoutes = ["/change-password", "/profile"];

// Define public routes (authentication pages) - using new structure
const authRoutes = [
  "/auth",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens from httpOnly cookies set by the API
  const accessToken = request.cookies.get("accessToken")?.value; // Updated to match API cookie name

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to /auth if trying to access protected route without token
  if (isProtectedRoute && !accessToken) {
    const url = new URL("/auth", request.url);
    return NextResponse.redirect(url);
  }

  // Redirect to home if trying to access auth pages while already authenticated
  // Exception: allow access to change-password even when authenticated
  if (isAuthRoute && accessToken && pathname !== "/change-password") {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
