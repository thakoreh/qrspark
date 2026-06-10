import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);

const protectedProxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect({ unauthenticatedUrl: new URL("/sign-in", req.url).toString() });
});

function failClosedProxy(req: NextRequest) {
  if (isProtectedRoute(req)) {
    return NextResponse.json({ error: "Authentication is not configured" }, { status: 503 });
  }
  return NextResponse.next();
}

export default hasClerk ? protectedProxy : failClosedProxy;

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/__clerk/:path*"],
};
