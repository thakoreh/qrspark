"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, Field, Panel, inputClass } from "@/components/ui";

export function SmartRedirect() {
  const [rows, setRows] = useState([{ url: "https://brand.example/menu-a", weight: 60 }, { url: "https://brand.example/menu-b", weight: 40 }]);
  const total = rows.reduce((sum, row) => sum + Number(row.weight || 0), 0);
  return <Panel className="grid gap-4">
    <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Smart Redirect demo</p><h2 className="text-2xl font-semibold tracking-tight">Preview A/B destinations behind one QR.</h2><p className="mt-2 text-sm text-zinc-500">Edit split weights locally. The API demo redirects and logs scans; Convex persistence is required for production rules and conversion history.</p></div>
    <div className="grid gap-3">{rows.map((row, index) => <div key={index} className="grid gap-3 rounded-3xl border border-zinc-200 p-3 dark:border-white/10 sm:grid-cols-[1fr_110px]"><Field label={`Variant ${String.fromCharCode(65 + index)}`}><input className={inputClass} value={row.url} onChange={(event) => setRows(rows.map((r, i) => i === index ? { ...r, url: event.target.value } : r))}/></Field><Field label="Split"><input className={inputClass} type="number" value={row.weight} onChange={(event) => setRows(rows.map((r, i) => i === index ? { ...r, weight: Number(event.target.value) } : r))}/></Field></div>)}</div>
    <div className="grid gap-3 sm:grid-cols-3"><Field label="UTM campaign"><input className={inputClass} defaultValue="summer-menu" /></Field><Field label="Conversion pixel"><input className={inputClass} defaultValue="lead_submit" /></Field><Field label="Split total"><input className={inputClass} value={`${total}%`} readOnly /></Field></div>
    <div className="flex flex-wrap gap-2"><button className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold dark:border-white/10" onClick={() => setRows([...rows, { url: "https://brand.example/new", weight: 10 }])}>Add variant</button><Button onClick={() => toast.info("Demo rules previewed. Connect Convex to persist redirect rules.")}>Preview redirect rules</Button></div>
  </Panel>;
}
