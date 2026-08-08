import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve Auth.js / NextAuth session cookie (supports standard, chunked, and prefixed cookie names)
  const hasSessionToken = request.cookies.getAll().some((cookie) =>
    cookie.name.includes("session-token")
  );

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/opportunities") ||
    pathname.startsWith("/calendar") ||
    pathname.startsWith("/reflection") ||
    pathname.startsWith("/profile");

  const isAuthRoute = pathname.startsWith("/auth");

  if (isProtectedRoute && !hasSessionToken) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasSessionToken) {
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
    "/auth",
  ],
};
