"use client";

import Link from "next/link";
import { Moon, QrCode, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { LinkButton } from "@/components/ui";

export function Nav() {
  const { theme, setTheme } = useTheme();
  const links = ["Generator", "AI QR Art", "Pricing", "Analytics"];
  return <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70">
    <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"><QrCode size={20} weight="bold" /></span>QRForge</Link>
      <nav className="hidden justify-center gap-6 md:flex">{links.map((item) => <Link key={item} href={item === "Pricing" ? "/pricing" : item === "Generator" ? "/dashboard/create" : `/#${item.toLowerCase().replaceAll(" ", "-")}`} className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">{item}</Link>)}</nav>
      <div className="flex items-center justify-end gap-2"><button aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="grid size-10 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition active:scale-[0.98] dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"><Sun className="hidden dark:block" size={18} /><Moon className="dark:hidden" size={18} /></button><LinkButton href="/dashboard" className="hidden sm:inline-flex">Try Free</LinkButton></div>
    </div>
  </header>;
}
