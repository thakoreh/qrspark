import { NextResponse, type NextRequest } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { getConvexHttpClient, getServerMutationSecret } from "@/lib/convex-server";
import { safeRedirectDestination, sanitizePublicSlug } from "@/lib/public-events";
import { weightedDestination } from "@/lib/qr";
import { clientKeyFromHeaders, createMemoryRateLimiter, rateLimitHeaders } from "@/lib/request-guards";

const scanLimiter = createMemoryRateLimiter({ limit: 240, windowMs: 60_000 });
const scanWindowMs = 60_000;
const scanLimit = 480;

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  let serverMutationSecret: string;
  try {
    serverMutationSecret = getServerMutationSecret();
  } catch {
    return NextResponse.json({ error: "Server mutation secret is not configured" }, { status: 503 });
  }

  const routeParams = await params;
  const slug = sanitizePublicSlug(routeParams.slug);
  if (!slug) {
    return NextResponse.json({ error: "Invalid QR slug" }, { status: 400 });
  }

  const clientKey = clientKeyFromHeaders(request.headers, `scan:${slug}`);
  const rateLimit = scanLimiter.check(clientKey);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many scan attempts" },
      { status: 429, headers: rateLimitHeaders(rateLimit) },
    );
  }

  const ua = request.headers.get("user-agent") || "unknown";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";
  const convex = getConvexHttpClient();
  const sharedRateLimit = await convex.mutation(api.rateLimits.checkAndConsume, {
    key: clientKey,
    limit: scanLimit,
    windowMs: scanWindowMs,
    serverMutationSecret,
  });
  if (!sharedRateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many scan attempts" },
      { status: 429, headers: rateLimitHeaders(sharedRateLimit) },
    );
  }

  const qr = await convex.query(api.qrCodes.publicBySlug, { slug, serverMutationSecret }).catch((error) => {
    console.error("scan_qr_lookup_failed", { slug, error: error instanceof Error ? error.message : String(error) });
    return null;
  });

  if (!qr) {
    return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  }

  const rawDestination = qr.variants?.length
    ? weightedDestination(qr.variants)
    : qr.destinationUrl;
  const destination = safeRedirectDestination(rawDestination);

  if (!destination) {
    console.error("scan_unsafe_destination", { slug, destination: rawDestination });
    return NextResponse.json({ error: "QR destination is not a safe web URL" }, { status: 422 });
  }

  const ipHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip)).then((b)=>Buffer.from(b).toString("hex").slice(0,12));

  await convex.mutation(api.scans.logScan, {
    slug,
    referrer: request.headers.get("referer") || undefined,
    device: ua.slice(0, 120),
    variantUrl: destination.href,
    serverMutationSecret,
  }).catch((error) => console.error("scan_log_failed", { slug, error: error instanceof Error ? error.message : String(error) }));

  console.log(JSON.stringify({ event: "scan", slug, ua: ua.slice(0, 120), ipHash, destination: destination.href }));
  return NextResponse.redirect(destination);
}
