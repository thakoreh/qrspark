# Production Site Redesign Spec

## Competitor Signals

Bitly emphasizes custom, trackable QR codes inside a broader link platform. Uniqode emphasizes dynamic editing, scan analytics, smart rules, branded QR experiences, scale, and security. QR Code Generator PRO emphasizes editable QR codes, high-quality print output, analytics, bulk creation, and team plans. Canva wins on fast static QR creation inside design workflows.

QRSpark already has useful app primitives, but the public site did not prove them. The main gaps were thin route architecture, nav links that behaved like homepage anchors or dashboard jumps, limited trust content, unclear dynamic-vs-static education, weak workflow storytelling, and pricing that lacked comparison context.

## Product Direction

Reposition QRSpark as a local-business QR campaign platform, not a commodity QR image generator. The public site should show that users can create print-safe QR codes, update destinations after printing, measure scans and conversions, and manage campaigns without fake analytics.

## Scope

- Replace the single-page public experience with route-backed pages for generator, use cases, dynamic QR education, analytics, trust, and pricing.
- Keep the signed-in dashboard structure intact.
- Add one generated campaign visual asset to make the site feel tangible.
- Reuse typed marketing content across pages to keep claims consistent.
- Update navigation, metadata, and sitemap for the new public routes.
- Verify lint, production build, and rendered desktop/mobile flows.

## Non-Goals

- No database schema changes.
- No new payment provider behavior.
- No fabricated customer logos, testimonials, or compliance certifications.
- No full dashboard redesign beyond public generator mode support.
