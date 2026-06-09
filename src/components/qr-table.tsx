"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { DownloadSimple, MagnifyingGlass, PencilSimple, QrCode } from "@phosphor-icons/react";
import { api } from "../../convex/_generated/api";
import { inputClass } from "@/components/ui";

export function QrTable() {
  const [query, setQuery] = useState("");
  const qrs = useQuery(api.qrCodes.listMine);
  const rows = useMemo(() => {
    const source = qrs ?? [];
    return source.filter((row) => `${row.name} ${row.kind} ${row.destinationUrl}`.toLowerCase().includes(query.toLowerCase()));
  }, [qrs, query]);
  const loading = qrs === undefined;

  return <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
    <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
      <label className="relative"><MagnifyingGlass className="absolute left-4 top-3.5 text-zinc-400" size={18}/><input className={`${inputClass} w-full pl-11`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your campaigns" /></label>
      <button disabled={!rows.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-zinc-200 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10"><DownloadSimple size={18}/> Export CSV</button>
    </div>

    {loading ? <div className="grid gap-3 py-8">
      {[0,1,2].map((item) => <div key={item} className="h-14 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />)}
    </div> : rows.length === 0 ? <div className="grid place-items-center rounded-lg border border-dashed border-zinc-200 px-6 py-12 text-center dark:border-white/10">
      <div className="grid size-14 place-items-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"><QrCode size={28} weight="bold" /></div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight">No QR campaigns yet</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">Your workspace starts clean. Create your first campaign QR, then scans and conversions will appear here.</p>
      <a href="/dashboard/create" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">Create first QR</a>
    </div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-xs uppercase tracking-[0.16em] text-zinc-500"><tr><th className="py-3">Name</th><th>Type</th><th>Destination</th><th>Created</th><th>Status</th><th></th></tr></thead><tbody className="divide-y divide-zinc-200 dark:divide-white/10">{rows.map((row) => <tr key={row._id} className="align-middle"><td className="py-4"><p className="font-semibold">{row.name}</p><p className="text-xs text-zinc-500">/{row.slug}</p></td><td className="capitalize">{row.kind}</td><td className="max-w-[260px] truncate">{row.destinationUrl}</td><td>{new Date(row.createdAt).toLocaleDateString()}</td><td><span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">Active</span></td><td><button className="grid size-9 place-items-center rounded-md border border-zinc-200 dark:border-white/10" aria-label={`Edit ${row.name}`}><PencilSimple size={16}/></button></td></tr>)}</tbody></table></div>}
  </div>;
}
