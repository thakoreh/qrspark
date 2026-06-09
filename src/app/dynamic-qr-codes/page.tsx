import type { Metadata } from "next";
import { ArrowRight, CheckCircle, QrCode, SplitHorizontal } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/nav";
import { Badge, LinkButton, Panel } from "@/components/ui";
import { faqs, workflowSteps } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Dynamic QR Codes | QRSpark",
  description: "Learn how dynamic QR codes let teams edit destinations after printing, track scans, and run smart redirect tests.",
};

const comparison = [
  ["Static QR", "Encodes the final content directly.", "Best for permanent content that does not need tracking or edits."],
  ["Dynamic QR", "Encodes a redirect URL that QRSpark manages.", "Best for campaigns, printed materials, analytics, and destination changes."],
] as const;

export default function DynamicQrCodesPage() {
  return <div className="min-h-[100dvh] bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"><Nav />
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div><Badge>Dynamic QR codes</Badge><h1 className="mt-4 text-5xl font-semibold tracking-tight">Print once. Change destinations later.</h1><p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">Dynamic QR codes protect campaigns from expired offers, broken URLs, seasonal changes, and tests that happen after materials are already printed.</p><LinkButton href="/generator" className="mt-7 gap-2">Try the generator <ArrowRight size={17}/></LinkButton></div>
        <Panel className="p-6"><SplitHorizontal size={32} weight="bold" className="text-emerald-600"/><div className="mt-6 grid gap-3">{["Printed QR points to QRSpark redirect", "Redirect sends scanner to the active destination", "Dashboard records scan and conversion events", "Destination can change without new print materials"].map((item) => <p key={item} className="flex gap-2 text-sm font-medium"><CheckCircle className="mt-0.5 shrink-0 text-emerald-600" size={17}/>{item}</p>)}</div></Panel>
      </section>
      <section className="mt-12 grid gap-4 md:grid-cols-2">{comparison.map(([title, body, best]) => <Panel key={title} className="p-6"><QrCode size={28} weight="bold" className="text-emerald-600"/><h2 className="mt-5 text-2xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-zinc-500">{body}</p><p className="mt-4 font-medium">{best}</p></Panel>)}</section>
      <section className="mt-14"><h2 className="text-4xl font-semibold tracking-tight">How QRSpark handles dynamic campaigns</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{workflowSteps.map((step) => <Panel key={step.step} className="p-5"><p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{step.step}</p><h3 className="mt-3 text-xl font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{step.body}</p></Panel>)}</div></section>
      <section className="mt-14 grid gap-4 md:grid-cols-2">{faqs.slice(0, 3).map((faq) => <Panel key={faq.question} className="p-5"><h2 className="font-semibold">{faq.question}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{faq.answer}</p></Panel>)}</section>
    </main>
  </div>;
}
