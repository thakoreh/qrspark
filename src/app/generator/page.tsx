import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/nav";
import { QrGenerator } from "@/components/qr-generator";
import { Badge, LinkButton, Panel } from "@/components/ui";

export const metadata: Metadata = {
  title: "Free QR Code Generator | QRSpark",
  description: "Create print-ready PNG, SVG, and PDF QR codes, then upgrade to dynamic QR campaigns when you need editable destinations and scan analytics.",
};

export default function GeneratorPage() {
  return <div className="min-h-[100dvh] bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"><Nav />
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div><Badge>Public generator</Badge><h1 className="mt-4 text-5xl font-semibold tracking-tight">Create a QR code before you create an account.</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">Generate and export a QR for URLs, text, WiFi, vCards, email, SMS, and phone numbers. Save it to a workspace when you want dynamic redirects, analytics, and folders.</p></div>
        <Panel className="grid gap-3 p-5 sm:grid-cols-3">{["No account for exports", "PNG/SVG/PDF downloads", "Dynamic upgrade path"].map((item) => <p key={item} className="flex gap-2 text-sm font-medium"><CheckCircle className="mt-0.5 shrink-0 text-emerald-600" size={17}/>{item}</p>)}</Panel>
      </div>
      <QrGenerator mode="public" />
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Panel><h2 className="text-xl font-semibold">Static for permanent content</h2><p className="mt-3 text-sm leading-6 text-zinc-500">Use static QR codes when the final content should be encoded directly and never needs hosted analytics.</p></Panel>
        <Panel><h2 className="text-xl font-semibold">Dynamic for campaigns</h2><p className="mt-3 text-sm leading-6 text-zinc-500">Use dynamic QR codes when you need to change destinations, test offers, or measure scan performance.</p></Panel>
        <Panel><h2 className="text-xl font-semibold">Workspace for proof</h2><p className="mt-3 text-sm leading-6 text-zinc-500">Save campaigns to track scans, unique devices, conversions, and client-ready performance summaries.</p></Panel>
      </section>
      <div className="mt-10 flex flex-wrap gap-3"><LinkButton href="/sign-up" className="gap-2">Create workspace <ArrowRight size={17}/></LinkButton><Link href="/dynamic-qr-codes" className="inline-flex min-h-10 items-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold dark:border-white/10 dark:bg-zinc-900">Compare static vs dynamic</Link></div>
    </main>
  </div>;
}
