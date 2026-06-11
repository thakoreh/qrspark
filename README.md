# QRSpark

Smart QR campaign analytics MVP for local businesses and agencies turning print materials into measurable campaigns.

## Market positioning

Generic QR generation is a commodity. QR Code Generator Pro sells dynamic QR, scan limits, analytics, API, and teams from about $9.99/mo to $46.99/mo annual billing; Flowcode and Uniqode push higher-end brand/enterprise QR campaigns. QRSpark avoids the generic-generator trap by focusing on local-business campaign use cases: restaurant table tents, real estate signs, event flyers, gym offers, clinic intake, coupons, and agency client reporting.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4, dark/light mode
- Clerk auth
- Convex.dev database/backend schema for users, QR codes, scans, and conversions
- Stripe Checkout, billing portal, webhook route with env guards
- QR generation with `qrcode`, PNG/SVG/PDF exports
- Real workspace analytics, Recharts, Sonner toasts
- Coolify/Hetzner dynamic Next.js deployment target

## Implemented routes

- `/`: local-business QR campaign landing page
- `/pricing`: freemium and paid local campaign plans
- `/auth`: Clerk setup/sign-in panel
- `/dashboard`: campaign overview, QR list, stats
- `/dashboard/create`: live QR generator, styling, exports, AI art, Smart Redirect preview
- `/dashboard/analytics`: real scan and conversion charts
- `/dashboard/folders`: client/campaign collections
- `/admin`: operator dashboard for plans and usage
- `/api/scan/[slug]`: dynamic QR redirect with weighted A/B split, scan logging, slug safety, and rate limits
- `/api/conversion`: validated conversion pixel endpoint with rate and payload limits
- `/api/stripe/checkout`, `/api/stripe/portal`, `/api/webhooks/stripe`
- `/api/health`: readiness endpoint for production env checks and container health

## Pricing hypothesis

- Free: one campaign QR and basic scan preview
- Starter $9/mo: solo local business campaigns and print-ready exports
- Growth/Pro $19/mo: smart redirects, conversion pixels, and campaign attribution
- Team $39/mo: agency/client folders, team seat hypothesis, and white-label reporting workflow

## Production notes

- Protected routes fail closed when Clerk is not configured in production paths.
- `/api/health` returns `503` in production when required auth, Convex, Stripe, or app URL env vars are missing.
- Dynamic QR logging and conversion logging write to Convex when env vars and auth are configured.
- AI art requires Clerk auth, a Convex JWT template named `convex`, an OpenAI key, request limits, and available plan credits.
- Stripe Checkout requires a signed-in user. Billing portal sessions are created only for the authenticated user's stored Stripe customer.
- Security headers include CSP, frame blocking, content type sniffing protection, referrer policy, and permissions policy.
- Convex functions use `ctx.auth.getUserIdentity()` as the database security boundary.

## Required production env

Set these before deploying:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.example
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_JWT_ISSUER_DOMAIN=https://...
NEXT_PUBLIC_CONVEX_URL=https://...
CONVEX_SERVER_MUTATION_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_TEAM_PRICE_ID=price_...
BILLING_SYNC_SECRET=...
OPENAI_API_KEY=sk-...
QRFORGE_ADMIN_EMAIL=owner@example.com
QRFORGE_ADMIN_EMAILS=ops@example.com,finance@example.com
```

`OPENAI_API_KEY` is required only for AI poster generation. The app can serve QR, analytics, and billing flows without it, but `/api/ai/art` returns `503` until configured.

Set `BILLING_SYNC_SECRET` and `CONVEX_SERVER_MUTATION_SECRET` to strong random values. Each value must match between the Next.js runtime and Convex environment variables. Stripe webhook syncs and server-only analytics/rate-limit mutations are rejected unless the matching secret is present inside Convex.

`QRFORGE_ADMIN_EMAIL` and `QRFORGE_ADMIN_EMAILS` control access to `/admin`. Leave them empty to fail closed.

## CI

GitHub Actions runs the production quality gates on pull requests and pushes to `main`:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

## Deployment smoke check

After deployment, run:

```bash
SMOKE_BASE_URL=https://your-domain.example npm run production:smoke
```

The smoke check verifies `/api/health`, `/`, `/pricing`, and the required security headers. The Docker image also includes a healthcheck against `/api/health`.

## Verification
```bash
npm test
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```
