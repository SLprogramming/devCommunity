import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth"; // Adjust path to your Better Auth server setup

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Grab session token cookie for basic page protection
  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  // 2. Map out restricted authentication paths
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/reset-password");

  // 3. Bounce logged-in users away from authentication views
  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. Handle exact /profile route -> redirect to /profile/[userId]
  if (pathname === "/profile") {
    // Fetch user session directly from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // If not logged in, redirect to login page
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect to /profile/[userId]
    return NextResponse.redirect(
      new URL(`/profile/${session.user.id}`, request.url)
    );
  }

  // Fall through normally for all other routes
  return NextResponse.next();
}

// Keep the standard matcher configuration 
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};