import { NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";
import { getConvexHttpClient } from "@/lib/convex-server";

export async function POST(request: Request) {
  const event = await request.json().catch(() => ({}));
  const slug = String(event.slug || event.qr || "demo").slice(0, 120);
  const name = String(event.event || event.name || "conversion").slice(0, 80);
  const value = typeof event.value === "number" ? event.value : undefined;

  const convex = getConvexHttpClient();
  if (convex) {
    await convex.mutation(api.scans.logConversion, { slug, event: name, value })
      .catch((error) => console.error("conversion_log_failed", { slug, error: error instanceof Error ? error.message : String(error) }));
  }

  console.log(JSON.stringify({ event: "conversion", slug, name, at: new Date().toISOString() }));
  return NextResponse.json({ ok: true });
}
