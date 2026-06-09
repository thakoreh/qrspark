import { NextResponse, type NextRequest } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { getConvexHttpClient } from "@/lib/convex-server";
import { weightedDestination } from "@/lib/qr";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ua = request.headers.get("user-agent") || "unknown";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";
  const destinations = [
    { url: `${request.nextUrl.origin}/?qr=${encodeURIComponent(slug)}&utm_source=qrspark&utm_variant=a`, weight: 60 },
    { url: `${request.nextUrl.origin}/?qr=${encodeURIComponent(slug)}&utm_source=qrspark&utm_variant=b`, weight: 40 },
  ];
  const destination = weightedDestination(destinations);
  const ipHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip)).then((b)=>Buffer.from(b).toString("hex").slice(0,12));

  const convex = getConvexHttpClient();
  if (convex) {
    await convex.mutation(api.scans.logScan, {
      slug,
      referrer: request.headers.get("referer") || undefined,
      device: ua.slice(0, 120),
      variantUrl: destination,
    }).catch((error) => console.error("scan_log_failed", { slug, error: error instanceof Error ? error.message : String(error) }));
  }

  console.log(JSON.stringify({ event: "scan", slug, ua: ua.slice(0, 120), ipHash }));
  return NextResponse.redirect(destination);
}
