// Approach 1: Define protected routes explicitly
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const currentPath = request.nextUrl.pathname;

  // Skip auth check for API routes - let them handle their own auth
  if (currentPath.startsWith("/api/")) {
    return supabaseResponse;
  }

  // Define protected routes
  const protectedRoutes = [
    "/appointments",
    "/profile",
    "/dashboard",
    "/settings",
    "/patients",
    "/medical-records",
    "/book",
    // Add more protected routes as needed
  ];

  // Check if current path needs protection
  const isProtectedRoute = protectedRoutes.some(
    (route) => currentPath === route || currentPath.startsWith(route + "/")
  );

  // If not a protected route, allow access without auth check
  if (!isProtectedRoute) {
    return supabaseResponse;
  }

  // Only create Supabase client for protected routes
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Store where they were trying to go
    url.searchParams.set("redirectTo", currentPath);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
