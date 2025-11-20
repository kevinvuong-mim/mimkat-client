import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicRoute } from "@/lib/utils";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens from httpOnly cookies set by the API
  const accessToken = request.cookies.get("accessToken")?.value;

  // Check if the current path is a public route
  const isPublic = isPublicRoute(pathname);

  // If it's a public route and user is authenticated, redirect to home
  if (isPublic && accessToken) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  // If it's a private route (not in publicRoutes) and no token, redirect to login
  if (!isPublic && !accessToken) {
    const url = new URL("/login", request.url);
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
     * - images (static image files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
