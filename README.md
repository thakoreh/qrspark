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
- Recharts demo analytics, Sonner toasts
- Coolify/Hetzner dynamic Next.js deployment target

## Implemented routes

- `/`: local-business QR campaign landing page
- `/pricing`: freemium and paid local campaign plans
- `/auth`: Clerk setup/sign-in panel
- `/dashboard`: demo campaign overview, QR list, stats
- `/dashboard/create`: live QR generator, styling, exports, AI art provider-ready demo button, Smart Redirect preview
- `/dashboard/analytics`: demo scan and conversion charts
- `/dashboard/folders`: client/campaign collections
- `/admin`: operator dashboard for plans and usage
- `/api/scan/[slug]`: demo dynamic QR redirect with weighted A/B split and server-log scan events
- `/api/conversion`: conversion pixel endpoint
- `/api/stripe/checkout`, `/api/stripe/portal`, `/api/webhooks/stripe`

## Pricing hypothesis

- Free: one campaign QR and basic scan preview
- Starter $9/mo: solo local business campaigns and print-ready exports
- Growth/Pro $19/mo: smart redirects, conversion pixels, and campaign attribution
- Team $39/mo: agency/client folders and white-label workflow placeholder

## Production notes

- The AI art endpoint is key-aware. It returns scan-safe demo output without keys and is ready to wire to the preferred OpenAI or Replicate Flux model.
- Dynamic QR logging currently writes structured events to server logs in demo mode. Connect it to Convex mutations once env vars are set.
- Convex functions use `ctx.auth.getUserIdentity()` as the database security boundary.

## Verification
```bash
npm run lint
npm run build
```
