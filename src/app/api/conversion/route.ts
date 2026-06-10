import { NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";
import { getConvexHttpClient, getServerMutationSecret } from "@/lib/convex-server";
import { parseConversionPayload } from "@/lib/public-events";
import {
  clientKeyFromHeaders,
  createMemoryRateLimiter,
  parseJsonWithLimit,
  rateLimitHeaders,
} from "@/lib/request-guards";

const conversionLimiter = createMemoryRateLimiter({ limit: 60, windowMs: 60_000 });
const maxConversionBodyBytes = 2048;
const conversionWindowMs = 60_000;
const conversionLimit = 120;

export async function POST(request: Request) {
  let serverMutationSecret: string;
  try {
    serverMutationSecret = getServerMutationSecret();
  } catch {
    return NextResponse.json({ error: "Server mutation secret is not configured" }, { status: 503 });
  }

  const clientKey = clientKeyFromHeaders(request.headers, "conversion");
  const rateLimit = conversionLimiter.check(clientKey);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many conversion events" },
      { status: 429, headers: rateLimitHeaders(rateLimit) },
    );
  }

  const convex = getConvexHttpClient();
  const sharedRateLimit = await convex.mutation(api.rateLimits.checkAndConsume, {
    key: clientKey,
    limit: conversionLimit,
    windowMs: conversionWindowMs,
    serverMutationSecret,
  });
  if (!sharedRateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many conversion events" },
      { status: 429, headers: rateLimitHeaders(sharedRateLimit) },
    );
  }

  const body = await parseJsonWithLimit(request, maxConversionBodyBytes);
  if (!body.ok) {
    return NextResponse.json({ error: body.reason }, { status: body.reason === "Payload too large" ? 413 : 400 });
  }

  const parsed = parseConversionPayload(body.data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid conversion event" }, { status: 400 });
  }

  const { slug, event, value } = parsed.data;

  await convex.mutation(api.scans.logConversion, { slug, event, value, serverMutationSecret })
    .catch((error) => console.error("conversion_log_failed", { slug, error: error instanceof Error ? error.message : String(error) }));

  console.log(JSON.stringify({ event: "conversion", slug, name: event, at: new Date().toISOString() }));
  return NextResponse.json({ ok: true });
}
