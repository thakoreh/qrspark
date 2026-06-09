import { DashboardShell } from "@/components/dashboard-shell";
import { Panel } from "@/components/ui";
import { plans } from "@/lib/plans";

export default function AdminPage() {
  return (
    <DashboardShell>
      <div className="grid gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Admin demo</p>
          <h1 className="text-4xl font-semibold tracking-tighter">QRSpark operations preview</h1>
          <p className="mt-2 text-zinc-500">
            Demo view for plan, usage, billing, AI credit, and webhook controls. Connect Convex and Stripe webhooks before treating these as live metrics.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Panel><p className="text-sm text-zinc-500">Demo accounts</p><p className="mt-3 text-4xl font-semibold">18</p></Panel>
          <Panel><p className="text-sm text-zinc-500">Demo AI credits used</p><p className="mt-3 text-4xl font-semibold">742</p></Panel>
          <Panel><p className="text-sm text-zinc-500">Webhook route</p><p className="mt-3 text-4xl font-semibold text-amber-600">Needs env</p></Panel>
        </div>
        <Panel>
          <h2 className="text-2xl font-semibold">Plan controls preview</h2>
          <div className="mt-4 grid gap-3">
            {plans.map((plan) => (
              <div key={plan.id} className="grid gap-2 rounded-3xl border border-zinc-200 p-4 dark:border-white/10 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-semibold">{plan.name} ${plan.price}/mo</p>
                  <p className="text-sm text-zinc-500">Configured limits preview. AI credits: {plan.limits.aiCredits}.</p>
                </div>
                <span className="self-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold dark:bg-white/10">Preview</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
