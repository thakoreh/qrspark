import Link from "next/link";
import { ChartLineUp, Folders, House, MagicWand, QrCode, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Toaster } from "sonner";
import { getUser } from "@/lib/supabase/server";

const nav = [
  { href: "/dashboard", label: "Overview", icon: House },
  { href: "/dashboard/create", label: "Create", icon: QrCode },
  { href: "/dashboard/analytics", label: "Analytics", icon: ChartLineUp },
  { href: "/dashboard/folders", label: "Folders", icon: Folders },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

export async function DashboardShell({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return <div className="min-h-[100dvh] bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
    <Toaster richColors position="top-right" />
    <div className="mx-auto grid max-w-7xl gap-4 p-3 md:grid-cols-[240px_1fr] md:p-5">
      <aside className="rounded-[2rem] border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 md:sticky md:top-5 md:h-[calc(100dvh-2.5rem)]">
        <Link href="/" className="mb-6 flex items-center gap-2 font-semibold"><span className="grid size-9 place-items-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"><MagicWand size={18} weight="bold" /></span>QRForge</Link>
        <nav className="grid gap-1">{nav.map((item) => <Link href={item.href} key={item.href} className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"><item.icon size={18} />{item.label}</Link>)}</nav>
        <div className="mt-6 rounded-3xl bg-zinc-100 p-4 text-sm dark:bg-zinc-950"><p className="font-semibold">{user?.email || "Demo workspace"}</p><p className="mt-1 text-zinc-500">Free plan: 1 dynamic QR included.</p></div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  </div>;
}
