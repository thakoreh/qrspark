# QRForge

Provider-ready SaaS MVP for branded QR codes, PNG/SVG/PDF exports, demo analytics, folders, Stripe subscription scaffolding, and Smart Redirect A/B testing demos.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4, dark/light mode
- Supabase Postgres, Auth, Storage-ready schema
- Stripe Checkout, billing portal, webhook route with env guards
- QR generation with `qrcode`, PNG/SVG/PDF exports
- Recharts demo analytics, Sonner toasts

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Demo mode works without Supabase or Stripe env vars. Auth actions show setup toasts, dashboard uses seed data, and paid checkout returns a clear 503 until Stripe is configured.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL editor.
3. Enable Auth providers:
   - Email magic links
   - Google OAuth
4. Create Storage bucket `qr-assets` for logos and AI art.
5. Replace the user id in `supabase/seed.sql` and run it for demo data.

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

## Vercel deploy

```bash
vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_STARTER_PRICE_ID
vercel env add STRIPE_PRO_PRICE_ID
vercel env add STRIPE_TEAM_PRICE_ID
vercel env add NEXT_PUBLIC_APP_URL
```

## Implemented routes

- `/`: SEO landing page modeled after QR-Verse: clean nav, announcement-style CTA, AI QR hero, guide/pricing sections
- `/pricing`: freemium and paid plans
- `/auth`: magic link and Google OAuth UI
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
- Dynamic QR logging currently writes structured events to server logs in demo mode. Connect it to Supabase inserts once env vars are set.
- RLS policies are included for user-owned records.
