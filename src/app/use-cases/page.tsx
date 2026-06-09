import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/nav";
import { Badge, LinkButton, Panel } from "@/components/ui";
import { campaignTypes, workflowSteps } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "QR Campaign Use Cases | QRSpark",
  description: "Use dynamic QR campaigns for restaurants, real estate, events, gyms, clinics, agencies, and local business print marketing.",
};

export default function UseCasesPage() {
  return <div className="min-h-[100dvh] bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"><Nav />
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section className="max-w-3xl"><Badge>Use cases</Badge><h1 className="mt-4 text-5xl font-semibold tracking-tight">Offline campaigns need different QR workflows than business cards.</h1><p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">QRSpark is tuned for teams that print QR codes into physical placements and need to know what happened after the scan.</p></section>
      <section className="mt-10 grid gap-4 md:grid-cols-2">{campaignTypes.map((type) => <Panel key={type.title} className="p-6"><h2 className="text-2xl font-semibold tracking-tight">{type.title}</h2><p className="mt-3 leading-7 text-zinc-500">{type.body}</p><p className="mt-5 flex gap-2 font-medium"><CheckCircle className="mt-0.5 shrink-0 text-emerald-600" size={19}/>{type.proof}</p></Panel>)}</section>
      <section className="mt-14 rounded-lg bg-zinc-950 p-6 text-white dark:bg-white dark:text-zinc-950 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]"><div><h2 className="text-3xl font-semibold tracking-tight">Campaign workflow by placement</h2><p className="mt-3 leading-7 text-zinc-300 dark:text-zinc-600">Use separate QR campaigns for each poster, flyer, table tent, or sign so reports answer where scans came from.</p></div><div className="grid gap-3 md:grid-cols-3">{workflowSteps.map((step) => <div key={step.step} className="rounded-lg border border-white/10 bg-white/10 p-4 dark:border-zinc-200 dark:bg-zinc-100"><p className="text-sm font-semibold text-emerald-300 dark:text-emerald-700">{step.step}</p><h3 className="mt-3 text-lg font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-300 dark:text-zinc-600">{step.body}</p></div>)}</div></div>
      </section>
      <div className="mt-10 flex flex-wrap gap-3"><LinkButton href="/generator" className="gap-2">Create a campaign QR <ArrowRight size={17}/></LinkButton><Link href="/analytics" className="inline-flex min-h-10 items-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold dark:border-white/10 dark:bg-zinc-900">See analytics</Link></div>
    </main>
  </div>;
}
