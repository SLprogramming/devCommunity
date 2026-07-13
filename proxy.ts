// src/proxy.ts (or /proxy.ts if not using src/)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The exported function MUST be named 'proxy'
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Grab your session cookies (Better Auth style tokens)
  const sessionToken = request.cookies.get("better-auth.session_token") || 
                       request.cookies.get("__Secure-better-auth.session_token");

  // 2. Map out your restricted authentication paths
  const isAuthPage = pathname.startsWith("/login") || 
                     pathname.startsWith("/signup") || 
                     pathname.startsWith("/reset-password");

  // 3. Bounce logged-in users away from authentication views
  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Fall through normally for other routes
  return NextResponse.next();
}

// Keep the standard matcher configuration 
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};