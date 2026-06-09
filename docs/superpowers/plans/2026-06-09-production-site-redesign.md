# Production Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make QRSpark feel like a production-ready, trustworthy, multipage QR campaign platform.

**Architecture:** Use Next.js App Router route folders for public pages, keep pages as Server Components where possible, and keep the QR builder as a focused Client Component. Shared marketing claims live in `src/lib/marketing.ts`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, Phosphor icons, Convex, Clerk, Stripe, `qrcode`, `jspdf`.

---

### Task 1: Shared Public Site Foundation

**Files:**
- Create: `src/lib/marketing.ts`
- Modify: `src/components/nav.tsx`
- Modify: `src/components/ui.tsx`
- Modify: `src/app/layout.tsx`

- [x] Add typed public nav, competitor signals, campaign types, workflow steps, analytics metrics, trust points, and FAQs.
- [x] Replace thin anchor-style nav with route-backed public navigation.
- [x] Tighten panel radii and shadows so repeated sections feel more professional.
- [x] Update global metadata to describe QRSpark as a QR campaign platform.

### Task 2: Multipage Public Route Architecture

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/pricing/page.tsx`
- Create: `src/app/generator/page.tsx`
- Create: `src/app/use-cases/page.tsx`
- Create: `src/app/dynamic-qr-codes/page.tsx`
- Create: `src/app/analytics/page.tsx`
- Create: `src/app/trust/page.tsx`

- [x] Rebuild the homepage as a strong overview with concrete workflow, image-led campaign proof, use cases, analytics, trust, and CTA sections.
- [x] Add a public generator page that lets visitors create and download before signing up.
- [x] Add route-backed education pages for use cases, dynamic QR codes, analytics, and trust.
- [x] Expand pricing with plan-fit guidance, comparison points, and FAQs.

### Task 3: Public Generator Workflow

**Files:**
- Modify: `src/components/qr-generator.tsx`

- [x] Add `mode="public"` support so unauthenticated visitors can generate and export without being pushed into a dashboard-only save path.
- [x] Keep dashboard mode capable of saving campaigns to Convex.
- [x] Improve export/download text and button labels for public confidence.

### Task 4: SEO And Production Hygiene

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`
- Use asset: `public/marketing/qr-campaign-counter.png`

- [x] Add public routes to the sitemap.
- [x] Use a generated campaign image in public pages.
- [x] Run lint and production build.
- [x] Run rendered desktop/mobile browser QA.

### Task 5: Commit And Push

**Files:**
- All changed files

- [x] Review `git diff`.
- [ ] Commit with a production-site message.
- [ ] Push `main` to origin.
