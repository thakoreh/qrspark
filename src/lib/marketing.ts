export const publicNav = [
  { href: "/generator", label: "Generator" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/dynamic-qr-codes", label: "Dynamic QR" },
  { href: "/analytics", label: "Analytics" },
  { href: "/pricing", label: "Pricing" },
] as const;

export const competitorSignals = [
  {
    name: "Bitly",
    signal: "Custom, trackable QR codes connected to broader link management.",
    gap: "QRSpark needs to lead with measurable offline campaigns, not just QR output.",
  },
  {
    name: "Uniqode",
    signal: "Dynamic QR editing, analytics, smart rules, security, and branded experiences.",
    gap: "QRSpark needs public trust pages that explain dynamic links, data, and print QA.",
  },
  {
    name: "QR Code Generator PRO",
    signal: "Editable QR codes, high-quality print exports, analytics, bulk creation, and team plans.",
    gap: "QRSpark needs clearer plan limits, workflows, and reasons to upgrade.",
  },
  {
    name: "Canva",
    signal: "Fast QR creation inside design workflows.",
    gap: "QRSpark should make the free generator obvious, then differentiate with tracking.",
  },
] as const;

export const campaignTypes = [
  {
    title: "Restaurants",
    body: "Menu QR codes, table-tent offers, catering lead forms, and seasonal promotions that can change after printing.",
    proof: "Track scans by table tent, flyer, or location.",
  },
  {
    title: "Real estate",
    body: "Open-house signs, brochure links, agent vCards, listing updates, and lead magnets for buyers walking by.",
    proof: "Compare scans across signs, neighborhoods, and events.",
  },
  {
    title: "Events",
    body: "Registration pages, sponsor offers, venue maps, surveys, and post-event follow-up links from one campaign workspace.",
    proof: "See which placements drove attendance or submissions.",
  },
  {
    title: "Gyms and clinics",
    body: "Trial passes, intake forms, referral cards, class schedules, and appointment links with clean print-ready exports.",
    proof: "Change destinations safely as offers expire.",
  },
] as const;

export const workflowSteps = [
  {
    step: "01",
    title: "Create a scan-safe code",
    body: "Pick a destination, campaign name, content type, colors, and export format built for print.",
  },
  {
    step: "02",
    title: "Update after printing",
    body: "Use dynamic links and smart redirects to change offers, fix mistakes, or split traffic without reprinting.",
  },
  {
    step: "03",
    title: "Measure the placement",
    body: "Track scans, unique devices, conversions, and campaign performance from real traffic only.",
  },
] as const;

export const analyticsMetrics = [
  "Total scans and unique devices",
  "Campaign, QR, and destination performance",
  "Daily scan trends for print runs and events",
  "Conversion events for lead forms, bookings, and offers",
  "A/B split reporting for smart redirects",
  "Client-ready summaries for agencies and operators",
] as const;

export const trustPoints = [
  "Dynamic QR codes use redirect links, so destinations can be edited after printing.",
  "Static QR codes are still available for content that should never depend on a hosted redirect.",
  "Analytics count live scans only, avoiding fake dashboard rows and inflated demo data.",
  "Stripe handles paid checkout and billing portal flows.",
  "High-error-correction QR output supports branded colors while protecting scan reliability.",
  "Sitemap, robots, metadata, and route-backed pages help the public site feel complete.",
] as const;

export const faqs = [
  {
    question: "Can I change a QR code after it is printed?",
    answer: "Yes, when you create it as a dynamic QR. The printed code points to a short redirect, and QRSpark can update the final destination behind it.",
  },
  {
    question: "Do static QR codes have analytics?",
    answer: "No. Static QR codes encode the final content directly, so there is no redirect layer to measure scans or change destinations.",
  },
  {
    question: "What makes this different from a free design-tool QR generator?",
    answer: "Free static generators are good for one-off codes. QRSpark is for campaigns that need editable destinations, performance reporting, folders, exports, and conversion tracking.",
  },
  {
    question: "Will my dashboard show fake sample data?",
    answer: "No. New workspaces start clean, and analytics appear only after your own QR campaigns receive traffic.",
  },
] as const;
