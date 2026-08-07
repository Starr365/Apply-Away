import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight Edge-compatible Route Protection Middleware.
 * Prevents Edge Function bundle bloat by checking session cookies directly,
 * keeping Edge Function size under 10KB (far below Vercel's 1MB limit).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve Auth.js / NextAuth session cookie (supports both dev and secure HTTPS production names)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/opportunities") ||
    pathname.startsWith("/calendar") ||
    pathname.startsWith("/reflection") ||
    pathname.startsWith("/profile");

  const isAuthRoute = pathname.startsWith("/login");

  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/opportunities/:path*",
    "/calendar/:path*",
    "/reflection/:path*",
    "/profile/:path*",
    "/login",
  ],
};
