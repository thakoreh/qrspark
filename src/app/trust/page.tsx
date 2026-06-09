import Image from "next/image";
import type { Metadata } from "next";
import { CheckCircle, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/nav";
import { Badge, LinkButton, Panel } from "@/components/ui";
import { faqs, trustPoints } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Trust, Print QA, and QR Reliability | QRSpark",
  description: "Review how QRSpark presents dynamic QR behavior, scan-safe output, clean analytics, Stripe billing, and public site production hygiene.",
};

export default function TrustPage() {
  return <div className="min-h-[100dvh] bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"><Nav />
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div><Badge>Trust</Badge><h1 className="mt-4 text-5xl font-semibold tracking-tight">A QR campaign tool should be clear before you print.</h1><p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">QRSpark avoids inflated demo analytics and explains the tradeoffs between static exports, dynamic redirects, scan tracking, and paid workspace features.</p><LinkButton href="/pricing" className="mt-7">Review plans</LinkButton></div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl shadow-zinc-950/10 dark:border-white/10 dark:bg-zinc-900"><Image src="/marketing/qr-campaign-counter.png" alt="Printed QR campaign materials used for campaign measurement" width={1672} height={941} className="aspect-[16/10] w-full object-cover" /></div>
      </section>
      <section className="mt-12 grid gap-4 md:grid-cols-2">{trustPoints.map((point) => <Panel key={point} className="p-5"><ShieldCheck size={24} weight="bold" className="text-emerald-600"/><p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-300">{point}</p></Panel>)}</section>
      <section className="mt-14"><h2 className="text-4xl font-semibold tracking-tight">Questions buyers ask before printing</h2><div className="mt-8 grid gap-4 md:grid-cols-2">{faqs.map((faq) => <Panel key={faq.question} className="p-5"><h3 className="flex gap-2 font-semibold"><CheckCircle className="mt-0.5 shrink-0 text-emerald-600" size={18}/>{faq.question}</h3><p className="mt-3 text-sm leading-6 text-zinc-500">{faq.answer}</p></Panel>)}</div></section>
    </main>
  </div>;
}
