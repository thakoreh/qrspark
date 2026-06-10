"use client";

import { UserButton } from "@clerk/nextjs";

export function DashboardAccountActions({ email }: { email?: string }) {
  return <div className="mt-6 grid gap-3 rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-950">
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0"><p className="truncate font-semibold">{email || "Workspace"}</p><p className="mt-1 text-zinc-500">Free plan: 1 dynamic QR included.</p></div>
      <UserButton />
    </div>
    <a href="/pricing" className="inline-flex min-h-9 items-center justify-center rounded-md bg-emerald-600 px-3 text-xs font-semibold text-white dark:bg-emerald-400 dark:text-zinc-950">Upgrade plan</a>
  </div>;
}
