import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Proxy logic goes here
  console.log("Proxying request:", request.url);
}

export const config = {
  matcher:
    "/((?!api|_next/data|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};

// Proxy will still run for /_next/data/* routes despite being excluded
