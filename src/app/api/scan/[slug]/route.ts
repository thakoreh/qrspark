import { NextResponse, type NextRequest } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { getConvexHttpClient } from "@/lib/convex-server";
import { weightedDestination } from "@/lib/qr";

function requestOrigin(request: NextRequest) {
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
  return `${proto}://${host}`;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ua = request.headers.get("user-agent") || "unknown";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";
  const origin = requestOrigin(request);
  const convex = getConvexHttpClient();
  const qr = convex ? await convex.query(api.qrCodes.publicBySlug, { slug }).catch((error) => {
    console.error("scan_qr_lookup_failed", { slug, error: error instanceof Error ? error.message : String(error) });
    return null;
  }) : null;

  const destination = qr?.variants?.length
    ? weightedDestination(qr.variants)
    : qr?.destinationUrl || `${origin}/?qr=${encodeURIComponent(slug)}&utm_source=qrspark&utm_variant=fallback`;

  const ipHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip)).then((b)=>Buffer.from(b).toString("hex").slice(0,12));

  if (convex) {
    await convex.mutation(api.scans.logScan, {
      slug,
      referrer: request.headers.get("referer") || undefined,
      device: ua.slice(0, 120),
      variantUrl: destination,
    }).catch((error) => console.error("scan_log_failed", { slug, error: error instanceof Error ? error.message : String(error) }));
  }

  console.log(JSON.stringify({ event: "scan", slug, ua: ua.slice(0, 120), ipHash, destination }));
  return NextResponse.redirect(destination);
}
