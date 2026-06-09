import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const publicPaths = ["/", "/pricing", "/auth", "/auth/callback", "/robots.txt", "/sitemap.xml"];
  const pathname = request.nextUrl.pathname;
  if (publicPaths.includes(pathname) || pathname.startsWith("/api") || pathname.startsWith("/_next")) return NextResponse.next();
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
