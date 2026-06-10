"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { DownloadSimple, MagnifyingGlass, PencilSimple, QrCode, ChartLineUp, LinkSimple } from "@phosphor-icons/react";
import { api } from "../../convex/_generated/api";
import { inputClass } from "@/components/ui";

type QrRow = { _id: string; name: string; kind: string; slug: string; destinationUrl: string; createdAt: number };
type CampaignStats = { slug: string; scanCount: number; conversionCount: number };

export function QrTable({ focusSlug = "" }: { focusSlug?: string }) {
  const [query, setQuery] = useState(focusSlug);
  const qrs = useQuery(api.qrCodes.listMine);
  const analytics = useQuery(api.qrCodes.analyticsMine);
  const statsBySlug = useMemo(() => new Map<string, CampaignStats>((analytics?.campaigns ?? []).map((campaign: CampaignStats) => [campaign.slug, campaign])), [analytics]);
  const rows = useMemo(() => {
    const source = (qrs ?? []) as QrRow[];
    return source.filter((row: QrRow) => `${row.name} ${row.kind} ${row.destinationUrl} ${row.slug}`.toLowerCase().includes(query.toLowerCase()));
  }, [qrs, query]);
  const loading = qrs === undefined;

  function scanUrl(slug: string) {
    if (typeof window === "undefined") return `/api/scan/${slug}`;
    return `${window.location.origin}/api/scan/${slug}`;
  }

  return <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
    <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
      <label className="relative"><MagnifyingGlass className="absolute left-4 top-3.5 text-zinc-400" size={18}/><input className={`${inputClass} w-full pl-11`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search campaigns by name, slug, destination" /></label>
      <button disabled={!rows.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-zinc-200 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10"><DownloadSimple size={18}/> Export CSV</button>
    </div>

    {loading ? <div className="grid gap-3 py-8">
      {[0,1,2].map((item) => <div key={item} className="h-14 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />)}
    </div> : rows.length === 0 ? <div className="grid place-items-center rounded-lg border border-dashed border-zinc-200 px-6 py-12 text-center dark:border-white/10">
      <div className="grid size-14 place-items-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"><QrCode size={28} weight="bold" /></div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight">No QR campaigns found</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">Create and save a dynamic QR. It will appear here immediately, even before the first scan.</p>
      <a href="/dashboard/create" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">Create QR</a>
    </div> : <div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-sm"><thead className="text-xs uppercase tracking-[0.16em] text-zinc-500"><tr><th className="py-3">Campaign</th><th>Type</th><th>Destination</th><th>Scans</th><th>Conversions</th><th>Created</th><th>Actions</th></tr></thead><tbody className="divide-y divide-zinc-200 dark:divide-white/10">{rows.map((row: QrRow) => {
      const stats = statsBySlug.get(row.slug);
      const highlighted = focusSlug && row.slug === focusSlug;
      return <tr key={row._id} className={`align-middle ${highlighted ? "bg-emerald-500/10" : ""}`}><td className="py-4"><p className="font-semibold">{row.name}</p><p className="text-xs text-zinc-500">/api/scan/{row.slug}</p></td><td className="capitalize">{row.kind}</td><td className="max-w-[260px] truncate">{row.destinationUrl}</td><td className="font-semibold">{stats?.scanCount ?? 0}</td><td>{stats?.conversionCount ?? 0}</td><td>{new Date(row.createdAt).toLocaleDateString()}</td><td><div className="flex gap-2"><a href={`/dashboard/analytics?qr=${encodeURIComponent(row.slug)}`} className="grid size-9 place-items-center rounded-md border border-zinc-200 dark:border-white/10" aria-label={`Track ${row.name}`} title="Track analytics"><ChartLineUp size={16}/></a><button onClick={() => navigator.clipboard?.writeText(scanUrl(row.slug))} className="grid size-9 place-items-center rounded-md border border-zinc-200 dark:border-white/10" aria-label={`Copy scan URL for ${row.name}`} title="Copy tracked URL"><LinkSimple size={16}/></button><button className="grid size-9 place-items-center rounded-md border border-zinc-200 dark:border-white/10" aria-label={`Edit ${row.name}`} title="Edit"><PencilSimple size={16}/></button></div></td></tr>;
    })}</tbody></table></div>}
  </div>;
}
