import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentClerkUser() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) return null;
  try {
    return await currentUser();
  } catch {
    return null;
  }
}
