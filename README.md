# QRForge

Provider-ready SaaS MVP for branded QR codes, PNG/SVG/PDF exports, demo analytics, folders, Stripe subscription scaffolding, and Smart Redirect A/B testing demos.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4, dark/light mode
- Clerk auth
- Convex.dev database/backend schema for users, QR codes, scans, and conversions
- Stripe Checkout, billing portal, webhook route with env guards
- QR generation with `qrcode`, PNG/SVG/PDF exports
- Recharts demo analytics, Sonner toasts
- Coolify/Hetzner dynamic Next.js deployment target

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Demo mode works without Clerk, Convex, or Stripe env vars. Auth actions show setup guidance, dashboard uses seed data, and paid checkout returns a clear 503 until Stripe is configured.

## Clerk + Convex setup

1. Create a Clerk app and configure email/social providers.
2. Create a Convex project and deploy the `convex/` schema/functions.
3. In Clerk, create a JWT template named `convex` with email/sub claims.
4. In Convex Dashboard → Settings → Auth, add Clerk as the auth provider.
5. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CONVEX_URL`, and `CONVEX_DEPLOYMENT` in Coolify.

## Stripe setup

Create recurring prices:

- Starter: $9/mo
- Pro: $19/mo
- Team: $39/mo

Set the price ids in `.env.local`, then add webhook endpoint:

```text
/api/webhooks/stripe
```

Events to listen for:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Coolify/Hetzner deploy

Deploy as a dynamic Next.js app, not a static export. Required envs:

```text
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CONVEX_URL
CONVEX_DEPLOYMENT
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_STARTER_PRICE_ID
STRIPE_PRO_PRICE_ID
STRIPE_TEAM_PRICE_ID
```

## Implemented routes

- `/`: SEO landing page modeled after QR-Verse: clean nav, announcement-style CTA, AI QR hero, guide/pricing sections
- `/pricing`: freemium and paid plans
- `/auth`: Clerk setup/sign-in panel
- `/dashboard`: demo overview, QR list, stats
- `/dashboard/create`: live QR generator, styling, exports, AI art provider-ready demo button, Smart Redirect preview
- `/dashboard/analytics`: demo scan and conversion charts
- `/dashboard/folders`: collections
- `/admin`: operator dashboard for plans and usage
- `/api/scan/[slug]`: demo dynamic QR redirect with weighted A/B split and server-log scan events
- `/api/conversion`: conversion pixel endpoint
- `/api/stripe/checkout`, `/api/stripe/portal`, `/api/webhooks/stripe`

## Production notes

- The AI art endpoint is key-aware. It returns scan-safe demo output without keys and is ready to wire to the preferred OpenAI or Replicate Flux model.
- Dynamic QR logging currently writes structured events to server logs in demo mode. Connect it to Convex mutations once env vars are set.
- Convex functions use `ctx.auth.getUserIdentity()` as the database security boundary.
