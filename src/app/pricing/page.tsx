import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/nav";
import { Badge, LinkButton, Panel } from "@/components/ui";
import { faqs } from "@/lib/marketing";
import { plans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing | QRSpark",
  description: "Compare QRSpark plans for static QR exports, dynamic QR campaigns, analytics, smart redirects, team seats, and white-label exports.",
};

const bestFor = {
  free: "Testing one dynamic campaign before you print.",
  starter: "Solo operators running a few local campaigns.",
  pro: "Businesses that need ongoing attribution and redirects.",
  team: "Agencies or teams managing client QR campaigns.",
} as const;

const planHighlights = [
  "Dynamic QR codes can be edited after printing.",
  "Static QR exports stay available for permanent content.",
  "Analytics appear from live scan traffic only.",
  "Stripe-secured billing and customer portal flows.",
] as const;

export default function PricingPage(){
  return <div className="min-h-[100dvh] bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"><Nav/>
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div><Badge>Pricing</Badge><h1 className="mt-4 text-5xl font-semibold tracking-tight">Plans for QR campaigns, not throwaway squares.</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">Start with a free QR workflow, then upgrade when printed campaigns need editable destinations, scan analytics, smart redirects, and client-ready reports.</p></div>
        <Panel className="grid gap-3 p-5 sm:grid-cols-2">{planHighlights.map((item) => <p key={item} className="flex gap-2 text-sm font-medium"><CheckCircle className="mt-0.5 shrink-0 text-emerald-600" size={17}/>{item}</p>)}</Panel>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{plans.map((plan)=><Panel key={plan.id} className={`p-6 ${plan.id === "pro" ? "border-emerald-500/70 ring-4 ring-emerald-500/10" : ""}`}>
        <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">{plan.name}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{bestFor[plan.id]}</p></div>{plan.id === "pro" ? <Badge className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">Popular</Badge> : null}</div>
        <p className="mt-6 text-4xl font-semibold">${plan.price}<span className="text-sm text-zinc-500">/mo</span></p>
        <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-500">{plan.headline}</p>
        <dl className="mt-5 grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="flex justify-between gap-3"><dt className="text-zinc-500">Dynamic QR</dt><dd className="font-semibold">{plan.limits.dynamic === -1 ? "Unlimited" : plan.limits.dynamic}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-zinc-500">Static QR</dt><dd className="font-semibold">{plan.limits.static === -1 ? "Unlimited" : plan.limits.static}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-zinc-500">Members</dt><dd className="font-semibold">{plan.limits.members}</dd></div>
        </dl>
        <ul className="mt-6 grid gap-2 text-sm">{plan.features.map((f)=><li key={f} className="flex gap-2"><Sparkle className="mt-0.5 shrink-0 text-emerald-600" size={15}/>{f}</li>)}</ul>
        <LinkButton href={plan.price ? `/api/stripe/checkout?plan=${plan.id}` : "/dashboard"} prefetch={false} className="mt-6 w-full">{plan.price ? "Subscribe" : "Start free"}</LinkButton>
      </Panel>)}</section>

      <section className="mt-14 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div><h2 className="text-4xl font-semibold tracking-tight">Which plan should I choose?</h2><p className="mt-3 leading-7 text-zinc-500">Competitor platforms commonly gate dynamic codes, analytics, team seats, and bulk workflows. QRSpark keeps the path simple: use free for testing, Pro when campaign measurement matters, Team when client work needs separation.</p><Link href="/use-cases" className="mt-5 inline-flex text-sm font-semibold text-emerald-700 dark:text-emerald-300">See campaign examples <ArrowRight className="ml-1" size={15}/></Link></div>
        <div className="grid gap-4 md:grid-cols-2">{faqs.map((faq) => <Panel key={faq.question} className="p-5"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{faq.answer}</p></Panel>)}</div>
      </section>
    </main>
  </div>;
}
