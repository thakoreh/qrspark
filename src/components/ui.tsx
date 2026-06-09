import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-200", className)}>{children}</span>;
}

export function Button({ className, ...props }: ComponentProps<"button">) {
  return <button className={cn("inline-flex min-h-10 items-center justify-center rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-950", className)} {...props} />;
}

export function LinkButton({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link className={cn("inline-flex min-h-10 items-center justify-center rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 active:scale-[0.98] dark:bg-white dark:text-zinc-950", className)} {...props} />;
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-[2rem] border border-zinc-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(24,24,27,0.35)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70", className)}>{children}</section>;
}

export function Field({ label, children, helper }: { label: string; children: ReactNode; helper?: string }) {
  return <label className="grid gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-100"><span>{label}</span>{children}{helper ? <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{helper}</span> : null}</label>;
}

export const inputClass = "min-h-11 w-full min-w-0 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-200/60 dark:border-white/10 dark:bg-zinc-950 dark:focus:border-white/30 dark:focus:ring-white/10";
