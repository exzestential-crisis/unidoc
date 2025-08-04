import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/updateSession";

const unprotectedRoutes = [
  "/",
  "/login",
  "/signup",
  "/about",
  "/public",
  "/doctor",
  "/messages",
];

const protectedRoutePrefix = [
  "/book",
  "/profile",
  "/settings",
  "/appointments",
  "/messages",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for Next.js internals and static files
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") // This catches all file extensions
  ) {
    return NextResponse.next();
  }

  // Allow unprotected routes
  if (unprotectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if the path is under any protected route prefix
  const isProtected = protectedRoutePrefix.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) {
    // If route is neither explicitly unprotected nor protected, allow by default
    return NextResponse.next();
  }

  // For protected routes, check session
  const response = await updateSession(request);

  // If updateSession redirected to /login, return that response
  if (response.status === 307 || response.status === 302) {
    return response;
  }

  // Otherwise allow request
  return NextResponse.next();
}

// Simplified matcher that avoids complex regex patterns
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
