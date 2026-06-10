import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Badge, Panel } from "@/components/ui";
import { isAdminEmail } from "@/lib/admin";
import { plans } from "@/lib/plans";
import { getReadiness } from "@/lib/readiness";

export const dynamic = "force-dynamic";

function statusBadge(ok: boolean) {
  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${ok ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-red-500/10 text-red-700 dark:text-red-300"}`}>
      {ok ? "Ready" : "Action needed"}
    </span>
  );
}

export default async function AdminPage() {
  const user = await currentUser().catch(() => null);
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!isAdminEmail(email)) notFound();

  const readiness = getReadiness();
  const operationalChecks = [
    ["Clerk auth", Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY)],
    ["Convex backend", Boolean(process.env.NEXT_PUBLIC_CONVEX_URL && process.env.CLERK_JWT_ISSUER_DOMAIN)],
    ["Stripe billing", Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET)],
    ["Paid prices", Boolean(process.env.STRIPE_STARTER_PRICE_ID && process.env.STRIPE_PRO_PRICE_ID && process.env.STRIPE_TEAM_PRICE_ID)],
    ["AI provider", Boolean(process.env.OPENAI_API_KEY)],
  ] as const;

  return (
    <main className="min-h-[100dvh] bg-zinc-50 px-4 py-8 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-5">
        <div className="flex flex-col justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900 sm:flex-row sm:items-end">
          <div>
            <Badge>Operator</Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">QRSpark production console</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Runtime readiness, billing configuration, and plan limits for the current deployment.
            </p>
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            <p className="font-semibold text-zinc-800 dark:text-zinc-100">{email}</p>
            <p>{new Date().toISOString()}</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Panel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Readiness</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Environment gate</h2>
              </div>
              {statusBadge(readiness.ok)}
            </div>
            {readiness.missing.length ? (
              <div className="mt-5 grid gap-2">
                {readiness.missing.map((key) => (
                  <code key={key} className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                    {key}
                  </code>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                Required production variables are present for this runtime mode.
              </p>
            )}
          </Panel>

          <Panel>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Services</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Integration checks</h2>
            <div className="mt-5 grid gap-3">
              {operationalChecks.map(([label, ok]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2 dark:border-white/10">
                  <span className="text-sm font-medium">{label}</span>
                  {statusBadge(ok)}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Plans</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Billing and entitlement map</h2>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Stripe price IDs are checked server-side at checkout.</p>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="py-3">Plan</th>
                  <th>Price</th>
                  <th>Dynamic QR</th>
                  <th>Static QR</th>
                  <th>AI credits</th>
                  <th>Members</th>
                  <th>Stripe price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/10">
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="py-3 font-semibold">{plan.name}</td>
                    <td>${plan.price}/mo</td>
                    <td>{plan.limits.dynamic === -1 ? "Unlimited" : plan.limits.dynamic}</td>
                    <td>{plan.limits.static === -1 ? "Unlimited" : plan.limits.static}</td>
                    <td>{plan.limits.aiCredits}</td>
                    <td>{plan.limits.members}</td>
                    <td>{plan.stripePriceId ? "Configured" : plan.price === 0 ? "Free" : "Missing"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </main>
  );
}
