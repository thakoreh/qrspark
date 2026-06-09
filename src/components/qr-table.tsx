"use client";

import { useMemo, useState } from "react";
import { DownloadSimple, MagnifyingGlass, PencilSimple } from "@phosphor-icons/react";
import { demoQrs } from "@/lib/demo-data";
import { inputClass } from "@/components/ui";

export function QrTable() {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => demoQrs.filter((row) => `${row.name} ${row.folder} ${row.type}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="rounded-[2rem] border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
    <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]"><label className="relative"><MagnifyingGlass className="absolute left-4 top-3.5 text-zinc-400" size={18}/><input className={`${inputClass} w-full pl-11`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search campaigns, folders, QR type" /></label><button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-semibold dark:border-white/10"><DownloadSimple size={18}/> Export CSV</button></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-xs uppercase tracking-[0.16em] text-zinc-500"><tr><th className="py-3">Name</th><th>Type</th><th>Folder</th><th>Scans</th><th>Unique</th><th>Conv.</th><th>Status</th><th></th></tr></thead><tbody className="divide-y divide-zinc-200 dark:divide-white/10">{rows.map((row) => <tr key={row.id} className="align-middle"><td className="py-4"><p className="font-semibold">{row.name}</p><p className="text-xs text-zinc-500">{row.destination}</p></td><td>{row.type}</td><td>{row.folder}</td><td>{row.scans}</td><td>{row.unique}</td><td>{row.conversionRate}%</td><td><span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{row.status}</span></td><td><button className="grid size-9 place-items-center rounded-full border border-zinc-200 dark:border-white/10"><PencilSimple size={16}/></button></td></tr>)}</tbody></table></div>
  </div>;
}
