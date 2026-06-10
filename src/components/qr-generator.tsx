"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { ArrowsClockwise, Sparkle, UploadSimple } from "@phosphor-icons/react";
import { Button, Field, Panel, inputClass } from "@/components/ui";
import { payloadFor, type QrKind } from "@/lib/qr";
import { api } from "../../convex/_generated/api";

const kinds: { id: QrKind; label: string }[] = [
  { id: "url", label: "URL" }, { id: "text", label: "Text" }, { id: "wifi", label: "WiFi" }, { id: "vcard", label: "vCard" }, { id: "email", label: "Email" }, { id: "sms", label: "SMS" }, { id: "phone", label: "Phone" },
];

export function QrGenerator({ mode = "dashboard" }: { mode?: "dashboard" | "public" }) {
  const isPublic = mode === "public";
  const createQr = useMutation(api.qrCodes.create);
  const [kind, setKind] = useState<QrKind>("url");
  const [campaignName, setCampaignName] = useState(isPublic ? "Spring menu flyer" : "My first campaign");
  const [values, setValues] = useState<Record<string, string>>({ url: "https://yourdomain.com/offer", content: "https://yourdomain.com/offer", ssid: "Guest WiFi", password: "welcome2026", name: "Maya Patel", company: "Northline Studio", email: "maya@northline.example", phone: "+131****1928" });
  const [dark, setDark] = useState("#18181b");
  const [light, setLight] = useState("#ffffff");
  const [style, setStyle] = useState("rounded");
  const [folder, setFolder] = useState("General");
  const [dynamic, setDynamic] = useState(true);
  const [slug, setSlug] = useState(() => `qr-${Date.now().toString(36)}`);
  const [logoUrl, setLogoUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [artUrl, setArtUrl] = useState("");
  const [loadingArt, setLoadingArt] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const destinationPayload = useMemo(() => payloadFor(kind, values), [kind, values]);
  const payload = useMemo(() => {
    if (!dynamic || typeof window === "undefined") return destinationPayload;
    return `${window.location.origin}/api/scan/${slug}`;
  }, [destinationPayload, dynamic, slug]);
  useEffect(() => {
    renderStyledQr({ payload, dark, light, style, logoUrl }).then(setDataUrl).catch(() => toast.error("QR preview failed"));
  }, [payload, dark, light, style, logoUrl]);
  function update(key: string, value: string) { setValues((current) => ({ ...current, [key]: value })); }
  async function download(format: "png" | "svg" | "pdf") {
    if (format === "png") { const a = document.createElement("a"); a.href = dataUrl; a.download = "qrspark-code.png"; a.click(); }
    if (format === "svg") { const svg = await QRCode.toString(payload, { type: "svg", color: { dark, light }, errorCorrectionLevel: "H", margin: 2 }); const blob = new Blob([svg], { type: "image/svg+xml" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "qrspark-code.svg"; a.click(); }
    if (format === "pdf") { const pdf = new jsPDF({ unit: "px", format: [560, 700] }); pdf.setFontSize(24); pdf.text("QRSpark QR Code", 70, 70); pdf.addImage(dataUrl, "PNG", 70, 110, 420, 420); pdf.save("qrspark-code.pdf"); }
    toast.success(`${format.toUpperCase()} export ready`);
  }
  async function makeArt() {
    setLoadingArt(true);
    const res = await fetch("/api/ai/art", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt: `${style} branded campaign poster`, qr: dataUrl }) });
    const json = await res.json();
    setArtUrl(json.imageUrl || "");
    setLoadingArt(false);
    toast[json.demo ? "warning" : "success"](json.demo ? (json.note || "AI art unavailable; scan-safe QR returned.") : "Art QR generated and scannability checked.");
  }
  async function saveCampaign() {
    if (isPublic) {
      window.location.href = "/sign-up";
      return;
    }
    const name = campaignName.trim() || "Untitled QR campaign";
    const cleanSlug = slug || `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "qr"}-${Date.now().toString(36)}`;
    setSlug(cleanSlug);
    const destinationUrl = kind === "url" ? values.url || destinationPayload : destinationPayload;
    await createQr({ name, slug: cleanSlug, destinationUrl, kind: dynamic ? "dynamic" : "static", folder, style: { foreground: dark, background: light, shape: style, logoUrl: logoUrl || undefined } });
    toast.success(dynamic ? "Saved. This QR now tracks scans in analytics." : "Saved to your workspace");
  }
  const field = (key: string, label: string, placeholder = "") => <Field label={label}><input className={inputClass} value={values[key] || ""} placeholder={placeholder} onChange={(event) => update(key, event.target.value)} /></Field>;
  return <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
    <Panel className="grid gap-5">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{isPublic ? "Free QR generator" : "One-click generator"}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">{isPublic ? "Create a print-ready QR before you sign up." : "Create, save, test, download."}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{isPublic ? "Exports work immediately. Create a free workspace when you want dynamic redirects, folders, and analytics." : "Saved campaigns appear in your workspace with scan analytics after real traffic arrives."}</p></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Campaign name"><input className={inputClass} value={campaignName} onChange={(event) => setCampaignName(event.target.value)} placeholder="Spring menu flyer" /></Field><Field label="Folder"><input className={inputClass} value={folder} onChange={(event) => setFolder(event.target.value || "General")} placeholder="Retail, Events, Clients..." /></Field></div>
      <div className="flex flex-wrap gap-2">{kinds.map((item) => <button key={item.id} onClick={() => setKind(item.id)} className={`rounded-md px-4 py-2 text-sm font-semibold transition active:scale-[0.98] ${kind === item.id ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950"}`}>{item.label}</button>)}</div>
      <div className="grid gap-4 sm:grid-cols-2">{kind === "url" && field("url", "Destination URL", "https://...")}{kind === "text" && <Field label="Text"><textarea className={`${inputClass} min-h-28 py-3`} value={values.content || ""} onChange={(event) => update("content", event.target.value)} /></Field>}{kind === "wifi" && <>{field("ssid", "Network name")}{field("password", "Password")}</>}{kind === "vcard" && <>{field("name", "Full name")}{field("company", "Company")}{field("phone", "Phone")}{field("email", "Email")}</>}{kind === "email" && <>{field("email", "Email")}{field("subject", "Subject")}</>}{kind === "sms" && <>{field("phone", "Phone")}{field("message", "Message")}</>}{kind === "phone" && field("phone", "Phone")}</div>
      <div className="grid gap-4 sm:grid-cols-3"><Field label="Foreground"><input type="color" className="h-11 w-full rounded-md border border-zinc-200 bg-white p-1 dark:border-white/10 dark:bg-zinc-950" value={dark} onChange={(event) => setDark(event.target.value)} /></Field><Field label="Background"><input type="color" className="h-11 w-full rounded-md border border-zinc-200 bg-white p-1 dark:border-white/10 dark:bg-zinc-950" value={light} onChange={(event) => setLight(event.target.value)} /></Field><Field label="Style"><select className={inputClass} value={style} onChange={(event) => setStyle(event.target.value)}><option>rounded</option><option>dots</option><option>minimal</option><option>poster</option></select></Field></div>
      <div className="grid gap-3 rounded-lg border border-zinc-200 p-4 dark:border-white/10"><label className="flex items-center justify-between gap-3 text-sm font-medium"><span>{isPublic ? "Preview as dynamic campaign" : "Dynamic QR with scan analytics"}</span><input type="checkbox" checked={dynamic} onChange={(event) => setDynamic(event.target.checked)} /></label><button onClick={() => fileRef.current?.click()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold active:scale-[0.98] dark:border-white/10 dark:bg-zinc-950"><UploadSimple size={18} /> Upload logo</button><input ref={fileRef} className="hidden" type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { setLogoUrl(String(reader.result || "")); toast.success("Logo added to preview and PNG/PDF exports"); }; reader.readAsDataURL(file); }} /></div>
    </Panel>
    <Panel className="grid gap-4 lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Live preview</p><h3 className="text-2xl font-semibold tracking-tight">Scan-safe output</h3></div><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">H correction</span></div>
      <div className="grid place-items-center rounded-lg bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_35%),linear-gradient(135deg,#fafafa,#f4f4f5)] p-3 dark:bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.18),transparent_35%),linear-gradient(135deg,#18181b,#09090b)]">{dataUrl ? <NextImage unoptimized src={artUrl || dataUrl} alt="QR preview" width={420} height={420} className="aspect-square w-full max-w-[380px] rounded-lg bg-white shadow-2xl" /> : <div className="size-72 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />}</div>
      <div className="grid grid-cols-3 gap-2"><button onClick={() => download("png")} className="rounded-md border border-zinc-200 py-2 text-sm font-semibold active:scale-[0.98] dark:border-white/10">PNG</button><button onClick={() => download("svg")} className="rounded-md border border-zinc-200 py-2 text-sm font-semibold active:scale-[0.98] dark:border-white/10">SVG</button><button onClick={() => download("pdf")} className="rounded-md border border-zinc-200 py-2 text-sm font-semibold active:scale-[0.98] dark:border-white/10">PDF</button></div>
      <Button onClick={saveCampaign}>{isPublic ? "Create free workspace" : "Save campaign"}</Button>
      <Button onClick={makeArt} disabled={loadingArt} className="gap-2 bg-emerald-600 text-white dark:bg-emerald-400 dark:text-zinc-950">{loadingArt ? <ArrowsClockwise className="animate-spin" size={18} /> : <Sparkle size={18} weight="bold" />} {isPublic ? "Preview artistic QR" : "Make Artistic"}</Button>
      <p className="text-sm text-zinc-500">{isPublic ? "PNG, SVG, and PDF exports are available now. Save to a workspace when you want editable destinations and analytics." : "Every saved QR is tied to your account. Scan analytics appear only after your own campaign receives traffic."}</p>
    </Panel>
  </div>;
}
async function renderStyledQr({ payload, dark, light, style, logoUrl }: { payload: string; dark: string; light: string; style: string; logoUrl: string }) {
  const qr = QRCode.create(payload, { errorCorrectionLevel: "H" });
  const count = qr.modules.size;
  const margin = 2;
  const size = 420;
  const cell = size / (count + margin * 2);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = dark;
  const radius = style === "minimal" ? 0 : style === "dots" ? cell / 2 : style === "poster" ? cell * 0.18 : cell * 0.28;
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!qr.modules.get(row, col)) continue;
      const x = (col + margin) * cell;
      const y = (row + margin) * cell;
      if (style === "dots") {
        ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, cell * 0.42, 0, Math.PI * 2);
        ctx.fill();
      } else {
        roundRect(ctx, x + cell * 0.06, y + cell * 0.06, cell * 0.88, cell * 0.88, radius);
        ctx.fill();
      }
    }
  }
  if (logoUrl) {
    const img = await loadImage(logoUrl);
    const logoSize = size * 0.2;
    const x = (size - logoSize) / 2;
    const y = (size - logoSize) / 2;
    roundRect(ctx, x - 10, y - 10, logoSize + 20, logoSize + 20, 18);
    ctx.fillStyle = light;
    ctx.fill();
    ctx.drawImage(img, x, y, logoSize, logoSize);
  }
  return canvas.toDataURL("image/png");
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
