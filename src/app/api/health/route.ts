import { NextResponse } from "next/server";
import { getReadiness, healthContract } from "@/lib/readiness";

export function GET() {
  const readiness = getReadiness();
  return NextResponse.json(
    { ...readiness, contract: healthContract, service: "qrspark", ts: new Date().toISOString() },
    { status: readiness.ok ? 200 : 503 },
  );
}
