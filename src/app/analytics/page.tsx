import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChartLineUp, CheckCircle, CursorClick, DeviceMobile, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/nav";
import { Badge, LinkButton, Panel } from "@/components/ui";
import { analyticsPageSignals } from "@/lib/analytics-marketing";
import { analyticsMetrics } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "QR Code Analytics | QRSpark",
  description: "Measure QR scans, unique devices, conversions, campaign split performance, and offline placement attribution.",
};

const stats = [
  [ChartLineUp, analyticsPageSignals[0]],
  [DeviceMobile, analyticsPageSignals[1]],
  [CursorClick, analyticsPageSignals[2]],
  [MapPin, analyticsPageSignals[3]],
] as const;

export default function AnalyticsPage() {
  return <div className="min-h-[100dvh] bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"><Nav />
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div><Badge>Analytics</Badge><h1 className="mt-4 text-5xl font-semibold tracking-tight">Know which physical placement worked.</h1><p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">QRSpark turns QR scans into campaign evidence: scan volume, unique devices, conversion events, and A/B redirect performance from real traffic only.</p><div className="mt-7 flex flex-wrap gap-3"><LinkButton href="/generator" className="gap-2">Create a trackable QR <ArrowRight size={17}/></LinkButton><Link href="/pricing" className="inline-flex min-h-10 items-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold dark:border-white/10 dark:bg-zinc-900">Compare plans</Link></div></div>
        <Panel className="p-5"><div className="grid gap-3 sm:grid-cols-2">{stats.map(([Icon, signal]) => <div key={signal.value} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-zinc-950"><Icon size={24} className="text-emerald-600"/><p className="mt-5 text-2xl font-semibold">{signal.value}</p><p className="text-sm text-zinc-500">{signal.label}</p></div>)}</div></Panel>
      </section>
      <section className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{analyticsMetrics.map((metric) => <Panel key={metric} className="p-5"><CheckCircle size={22} weight="bold" className="text-emerald-600"/><h2 className="mt-4 text-lg font-semibold">{metric}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Use this signal to decide which print placement, destination, or offer deserves more budget.</p></Panel>)}</section>
      <section className="mt-14 rounded-lg bg-zinc-950 p-6 text-white dark:bg-white dark:text-zinc-950 lg:p-8"><h2 className="text-3xl font-semibold tracking-tight">Clean dashboards beat fake dashboards.</h2><p className="mt-3 max-w-3xl leading-7 text-zinc-300 dark:text-zinc-600">New QRSpark workspaces start empty. Reports populate from your own scans, so operators and clients can trust the numbers they see.</p></section>
    </main>
  </div>;
}
