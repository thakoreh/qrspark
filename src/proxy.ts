import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);

const protectedProxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export default hasClerk ? protectedProxy : function openProxy() { return NextResponse.next(); };

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
