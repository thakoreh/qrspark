"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function AuthPanel() {
  if (!hasClerk) {
    return (
      <div className="grid gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
        <p className="font-semibold">Clerk setup required</p>
        <p>Add Clerk keys, configure the Convex JWT template named <code>convex</code>, then sign-in buttons will go live.</p>
        <Button onClick={() => toast.info("Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to enable Clerk auth.")}>Show setup reminder</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <SignInButton mode="modal">
        <Button>Sign in with Clerk</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="min-h-10 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold transition active:scale-[0.98] dark:border-white/10 dark:bg-zinc-900">Create account</button>
      </SignUpButton>
    </div>
  );
}
