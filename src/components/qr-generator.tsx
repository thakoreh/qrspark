"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { ArrowsClockwise, Sparkle, UploadSimple } from "@phosphor-icons/react";
import { Button, Field, Panel, inputClass } from "@/components/ui";
import { payloadFor, type QrKind } from "@/lib/qr";

const kinds: { id: QrKind; label: string }[] = [
  { id: "url", label: "URL" }, { id: "text", label: "Text" }, { id: "wifi", label: "WiFi" }, { id: "vcard", label: "vCard" }, { id: "email", label: "Email" }, { id: "sms", label: "SMS" }, { id: "phone", label: "Phone" },
];

export function QrGenerator() {
  const [kind, setKind] = useState<QrKind>("url");
  const [values, setValues] = useState<Record<string, string>>({ url: "https://qrforge.app/demo", content: "https://qrforge.app/demo", ssid: "QRForge Guest", password: "welcome2026", name: "Maya Patel", company: "Northline Studio", email: "maya@northline.example", phone: "+13128471928" });
  const [dark, setDark] = useState("#18181b");
  const [light, setLight] = useState("#ffffff");
  const [style, setStyle] = useState("rounded");
  const [dynamic, setDynamic] = useState(true);
  const [dataUrl, setDataUrl] = useState("");
  const [artUrl, setArtUrl] = useState("");
  const [loadingArt, setLoadingArt] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const payload = useMemo(() => payloadFor(kind, values), [kind, values]);
  useEffect(() => { QRCode.toDataURL(payload, { width: 420, margin: 2, color: { dark, light }, errorCorrectionLevel: "H" }).then(setDataUrl).catch(() => toast.error("QR preview failed")); }, [payload, dark, light]);
  function update(key: string, value: string) { setValues((current) => ({ ...current, [key]: value })); }
  async function download(format: "png" | "svg" | "pdf") {
    if (format === "png") { const a = document.createElement("a"); a.href = dataUrl; a.download = "qrforge-code.png"; a.click(); }
    if (format === "svg") { const svg = await QRCode.toString(payload, { type: "svg", color: { dark, light }, errorCorrectionLevel: "H" }); const blob = new Blob([svg], { type: "image/svg+xml" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "qrforge-code.svg"; a.click(); }
    if (format === "pdf") { const pdf = new jsPDF({ unit: "px", format: [560, 700] }); pdf.setFontSize(24); pdf.text("QRForge QR Code", 70, 70); pdf.addImage(dataUrl, "PNG", 70, 110, 420, 420); pdf.save("qrforge-code.pdf"); }
    toast.success(`${format.toUpperCase()} export ready`);
  }
  async function makeArt() {
    setLoadingArt(true);
    const res = await fetch("/api/ai/art", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt: `${style} branded campaign poster`, qr: dataUrl }) });
    const json = await res.json();
    setArtUrl(json.imageUrl || "");
    setLoadingArt(false);
    toast.success(json.demo ? "Demo art generated. Add AI key for production images." : "Art QR generated and scannability checked.");
  }
  const field = (key: string, label: string, placeholder = "") => <Field label={label}><input className={inputClass} value={values[key] || ""} placeholder={placeholder} onChange={(event) => update(key, event.target.value)} /></Field>;
  return <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
    <Panel className="grid gap-5">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">One-click generator</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Create, style, test, download.</h2></div>
      <div className="flex flex-wrap gap-2">{kinds.map((item) => <button key={item.id} onClick={() => setKind(item.id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.98] ${kind === item.id ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950"}`}>{item.label}</button>)}</div>
      <div className="grid gap-4 sm:grid-cols-2">{kind === "url" && field("url", "Destination URL", "https://...")}{kind === "text" && <Field label="Text"><textarea className={`${inputClass} min-h-28 py-3`} value={values.content || ""} onChange={(event) => update("content", event.target.value)} /></Field>}{kind === "wifi" && <>{field("ssid", "Network name")}{field("password", "Password")}</>}{kind === "vcard" && <>{field("name", "Full name")}{field("company", "Company")}{field("phone", "Phone")}{field("email", "Email")}</>}{kind === "email" && <>{field("email", "Email")}{field("subject", "Subject")}</>}{kind === "sms" && <>{field("phone", "Phone")}{field("message", "Message")}</>}{kind === "phone" && field("phone", "Phone")}</div>
      <div className="grid gap-4 sm:grid-cols-3"><Field label="Foreground"><input type="color" className="h-11 w-full rounded-2xl border border-zinc-200 bg-white p-1 dark:border-white/10 dark:bg-zinc-950" value={dark} onChange={(event) => setDark(event.target.value)} /></Field><Field label="Background"><input type="color" className="h-11 w-full rounded-2xl border border-zinc-200 bg-white p-1 dark:border-white/10 dark:bg-zinc-950" value={light} onChange={(event) => setLight(event.target.value)} /></Field><Field label="Style"><select className={inputClass} value={style} onChange={(event) => setStyle(event.target.value)}><option>rounded</option><option>dots</option><option>minimal</option><option>poster</option></select></Field></div>
      <div className="grid gap-3 rounded-[1.5rem] border border-zinc-200 p-4 dark:border-white/10"><label className="flex items-center justify-between gap-3 text-sm font-medium"><span>Demo dynamic QR redirect with log-only analytics</span><input type="checkbox" checked={dynamic} onChange={(event) => setDynamic(event.target.checked)} /></label><button onClick={() => fileRef.current?.click()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold active:scale-[0.98] dark:border-white/10 dark:bg-zinc-950"><UploadSimple size={18} /> Upload logo placeholder</button><input ref={fileRef} className="hidden" type="file" accept="image/*" onChange={() => toast.info("Logo upload is a UI placeholder in this MVP; exports use QR styling only.")} /></div>
    </Panel>
    <Panel className="grid gap-4 lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Live preview</p><h3 className="text-2xl font-semibold tracking-tight">Scan-safe output</h3></div><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">H correction</span></div>
      <div className="grid place-items-center rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_35%),linear-gradient(135deg,#fafafa,#f4f4f5)] p-6 dark:bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.18),transparent_35%),linear-gradient(135deg,#18181b,#09090b)]">{dataUrl ? <NextImage unoptimized src={artUrl || dataUrl} alt="QR preview" width={420} height={420} className="aspect-square w-full max-w-[360px] rounded-[1.5rem] bg-white p-4 shadow-2xl" /> : <div className="size-72 animate-pulse rounded-[2rem] bg-zinc-200 dark:bg-zinc-800" />}</div>
      <div className="grid grid-cols-3 gap-2"><button onClick={() => download("png")} className="rounded-full border border-zinc-200 py-2 text-sm font-semibold active:scale-[0.98] dark:border-white/10">PNG</button><button onClick={() => download("svg")} className="rounded-full border border-zinc-200 py-2 text-sm font-semibold active:scale-[0.98] dark:border-white/10">SVG</button><button onClick={() => download("pdf")} className="rounded-full border border-zinc-200 py-2 text-sm font-semibold active:scale-[0.98] dark:border-white/10">PDF</button></div>
      <Button onClick={makeArt} disabled={loadingArt} className="gap-2 bg-emerald-600 text-white dark:bg-emerald-400 dark:text-zinc-950">{loadingArt ? <ArrowsClockwise className="animate-spin" size={18} /> : <Sparkle size={18} weight="bold" />} Make Artistic</Button>
      <p className="text-sm text-zinc-500">Demo AI mode returns the scan-safe QR image and shows provider-ready wiring. Connect OpenAI or Replicate before claiming generated AI QR art.</p>
    </Panel>
  </div>;
}
