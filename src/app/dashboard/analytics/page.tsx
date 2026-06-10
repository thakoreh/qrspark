"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { ChartLineUp, CursorClick, QrCode, Users } from "@phosphor-icons/react";
import { api } from "../../../../convex/_generated/api";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { QrTable } from "@/components/qr-table";
import { Panel } from "@/components/ui";

type CampaignAnalytics = {
  name: string;
  slug: string;
  destinationUrl: string;
  scanCount: number;
  conversionCount: number;
  uniqueDevices: number;
};

export default function AnalyticsPage(){
  return <Suspense fallback={<div className="grid gap-4"><Panel className="h-40 animate-pulse"><span /></Panel></div>}><AnalyticsPageContent /></Suspense>;
}

function AnalyticsPageContent(){
  const params = useSearchParams();
  const focusSlug = params.get("qr") || "";
  const analytics = useQuery(api.qrCodes.analyticsMine);
  const hasData = (analytics?.scanCount ?? 0) > 0;
  const selected = useMemo(() => ((analytics?.campaigns ?? []) as CampaignAnalytics[]).find((campaign) => campaign.slug === focusSlug), [analytics, focusSlug]);
  const cards = [
    [QrCode, "Saved QR campaigns", analytics?.qrCount ?? 0],
    [ChartLineUp, "Total scans", analytics?.scanCount ?? 0],
    [Users, "Unique devices", analytics?.uniqueDevices ?? 0],
    [CursorClick, "Conversions", analytics?.conversionCount ?? 0],
  ] as const;

  return <div className="grid gap-5">
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Analytics</p><h1 className="text-4xl font-semibold tracking-tighter">Track saved QR campaigns</h1><p className="mt-2 max-w-3xl text-zinc-500">Every saved QR appears below immediately. Use the tracked `/api/scan/[slug]` URL on printed assets; every scan logs back to this dashboard.</p></div>
      <a href="/dashboard/create" className="inline-flex min-h-10 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">Create tracked QR</a>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([Icon, label, value]) => <Panel key={label}><Icon size={24} className="text-emerald-600"/><p className="mt-5 text-3xl font-semibold">{value.toLocaleString()}</p><p className="text-sm text-zinc-500">{label}</p></Panel>)}</div>

    {selected ? <Panel className="border-emerald-500/30 bg-emerald-500/10">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Selected campaign</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">{selected.name}</h2><p className="mt-1 break-all text-sm text-zinc-500">Tracked URL: {typeof window === "undefined" ? `/api/scan/${selected.slug}` : `${window.location.origin}/api/scan/${selected.slug}`}</p><p className="mt-1 break-all text-sm text-zinc-500">Destination: {selected.destinationUrl}</p></div>
        <div className="grid grid-cols-3 gap-3 text-center"><div className="rounded-lg bg-white/70 p-3 dark:bg-zinc-950/60"><p className="text-2xl font-semibold">{selected.scanCount}</p><p className="text-xs text-zinc-500">Scans</p></div><div className="rounded-lg bg-white/70 p-3 dark:bg-zinc-950/60"><p className="text-2xl font-semibold">{selected.uniqueDevices}</p><p className="text-xs text-zinc-500">Devices</p></div><div className="rounded-lg bg-white/70 p-3 dark:bg-zinc-950/60"><p className="text-2xl font-semibold">{selected.conversionCount}</p><p className="text-xs text-zinc-500">Conversions</p></div></div>
      </div>
    </Panel> : null}

    <QrTable focusSlug={focusSlug}/>
    <AnalyticsCharts hasData={hasData}/>
  </div>;
}
