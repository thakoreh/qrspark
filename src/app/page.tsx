import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChartLineUp, CheckCircle, CurrencyDollar, Folders, QrCode, ShieldCheck, SplitHorizontal } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/nav";
import { Badge, LinkButton, Panel } from "@/components/ui";
import { analyticsMetrics, campaignTypes, competitorSignals, workflowSteps } from "@/lib/marketing";

const productStats = [
  ["Dynamic codes", "Update destinations after print"],
  ["Scan analytics", "Real scan and conversion data"],
  ["Print exports", "PNG, SVG, and PDF downloads"],
] as const;

export default function Home() {
  return <div className="min-h-[100dvh] bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"><Nav />
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div className="self-center">
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.96] tracking-tight md:text-7xl">QRSpark QR campaign platform</h1>
          <p className="mt-6 max-w-[64ch] text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">Create print-ready QR codes, update destinations after printing, and prove which flyers, signs, menus, and table tents drive scans and conversions.</p>
          <div className="mt-8 flex flex-wrap gap-3"><LinkButton href="/generator" className="gap-2">Create a free QR <ArrowRight size={18}/></LinkButton><Link href="/dynamic-qr-codes" className="inline-flex min-h-10 items-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold dark:border-white/10 dark:bg-zinc-900">See dynamic QR workflow</Link></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">{productStats.map(([label, body]) => <div key={label} className="border-l border-zinc-300 pl-4 dark:border-white/15"><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-sm leading-5 text-zinc-500">{body}</p></div>)}</div>
        </div>
        <div className="grid gap-4">
          <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl shadow-zinc-950/10 dark:border-white/10 dark:bg-zinc-900">
            <Image src="/marketing/qr-campaign-counter.png" alt="Printed QR campaign materials with a phone and analytics dashboard" width={1672} height={941} priority className="aspect-[16/10] h-full w-full object-cover" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">{[["1,247", "scans"], ["7.8%", "conversion"], ["60/40", "A/B split"]].map(([value, label]) => <Panel key={label} className="p-4"><p className="text-3xl font-semibold tracking-tight">{value}</p><p className="text-sm text-zinc-500">{label}</p></Panel>)}</div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900/50">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div><Badge>Competitor audit</Badge><h2 className="mt-4 text-3xl font-semibold tracking-tight">The bar is higher than generating a square.</h2><p className="mt-3 text-sm leading-6 text-zinc-500">Leading QR products prove editing, analytics, branded output, scale, and trust before asking teams to print a code. QRSpark now answers those expectations across public routes.</p></div>
          <div className="grid gap-3 md:grid-cols-2">{competitorSignals.map((item) => <Panel key={item.name} className="p-4"><p className="font-semibold">{item.name}</p><p className="mt-2 text-sm leading-6 text-zinc-500">{item.signal}</p><p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">{item.gap}</p></Panel>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl"><h2 className="text-4xl font-semibold tracking-tight">One workflow from print design to proof.</h2><p className="mt-3 text-zinc-500">Static codes are fine for permanent content. Campaigns need a living redirect, analytics, and clean reporting.</p></div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{workflowSteps.map((step) => <Panel key={step.step} className="p-6"><p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{step.step}</p><h3 className="mt-4 text-2xl font-semibold tracking-tight">{step.title}</h3><p className="mt-3 text-sm leading-6 text-zinc-500">{step.body}</p></Panel>)}</div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_1fr]">
        <Panel className="p-7">
          <QrCode size={32} weight="bold" className="text-emerald-600" />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight">Start with a real generator.</h2>
          <p className="mt-3 leading-7 text-zinc-500">Visitors can create PNG, SVG, and PDF QR exports before creating an account. A workspace adds dynamic redirects, analytics, folders, and saved campaign history.</p>
          <LinkButton href="/generator" className="mt-6 gap-2">Open generator <ArrowRight size={17}/></LinkButton>
        </Panel>
        <Panel className="p-7">
          <SplitHorizontal size={32} weight="bold" className="text-emerald-600" />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight">Change printed campaigns safely.</h2>
          <p className="mt-3 leading-7 text-zinc-500">Dynamic QR codes route through QRSpark so teams can update destinations, split traffic, and attach conversion events without reprinting every flyer.</p>
          <LinkButton href="/dynamic-qr-codes" className="mt-6 gap-2">Learn dynamic QR <ArrowRight size={17}/></LinkButton>
        </Panel>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h2 className="text-4xl font-semibold tracking-tight">Built for local campaigns and agency clients.</h2><p className="mt-3 max-w-2xl text-zinc-500">The public site now shows concrete campaign contexts instead of vague QR utility.</p></div><Link href="/use-cases" className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">View all use cases</Link></div>
        <div className="grid gap-4 md:grid-cols-4">{campaignTypes.map((type) => <Panel key={type.title} className="p-5"><h3 className="text-xl font-semibold">{type.title}</h3><p className="mt-3 text-sm leading-6 text-zinc-500">{type.body}</p><p className="mt-4 flex gap-2 text-sm font-medium"><CheckCircle className="mt-0.5 text-emerald-600" size={17}/>{type.proof}</p></Panel>)}</div>
      </section>

      <section className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div><ChartLineUp size={34} weight="bold" className="text-emerald-300 dark:text-emerald-600"/><h2 className="mt-5 text-4xl font-semibold tracking-tight">Analytics that explain physical placement.</h2><p className="mt-4 leading-7 text-zinc-300 dark:text-zinc-600">Campaign data should answer whether the poster, menu, sign, or card worked. QRSpark keeps the dashboard clean until real scans arrive.</p><LinkButton href="/analytics" className="mt-6 bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white">Explore analytics</LinkButton></div>
          <div className="grid gap-3 sm:grid-cols-2">{analyticsMetrics.map((metric) => <div key={metric} className="rounded-lg border border-white/10 bg-white/10 p-4 text-sm font-medium text-zinc-100 dark:border-zinc-200 dark:bg-zinc-100 dark:text-zinc-700"><CheckCircle className="mb-3 text-emerald-300 dark:text-emerald-600" size={20}/>{metric}</div>)}</div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 lg:grid-cols-3">
        <Panel className="p-6"><ShieldCheck size={30} weight="bold" className="text-emerald-600"/><h2 className="mt-5 text-2xl font-semibold">Trust and print QA</h2><p className="mt-3 text-sm leading-6 text-zinc-500">No fake analytics, clear dynamic/static expectations, high-error-correction output, and transparent billing flows.</p><Link href="/trust" className="mt-5 inline-flex text-sm font-semibold text-emerald-700 dark:text-emerald-300">Review trust details</Link></Panel>
        <Panel className="p-6"><Folders size={30} weight="bold" className="text-emerald-600"/><h2 className="mt-5 text-2xl font-semibold">Workspace workflow</h2><p className="mt-3 text-sm leading-6 text-zinc-500">Create campaigns, organize folders, watch analytics, and keep client work separated as QR volume grows.</p><Link href="/dashboard" prefetch={false} className="mt-5 inline-flex text-sm font-semibold text-emerald-700 dark:text-emerald-300">Open dashboard</Link></Panel>
        <Panel className="p-6"><CurrencyDollar size={30} weight="bold" className="text-emerald-600"/><h2 className="mt-5 text-2xl font-semibold">Plans with real limits</h2><p className="mt-3 text-sm leading-6 text-zinc-500">Pricing now explains which teams need dynamic QR count, analytics depth, team seats, and white-label exports.</p><Link href="/pricing" className="mt-5 inline-flex text-sm font-semibold text-emerald-700 dark:text-emerald-300">Compare plans</Link></Panel>
      </section>
    </main>
  </div>;
}
