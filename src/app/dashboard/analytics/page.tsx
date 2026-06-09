"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { QrTable } from "@/components/qr-table";

export default function AnalyticsPage(){
  const analytics = useQuery(api.qrCodes.analyticsMine);
  const hasData = (analytics?.scanCount ?? 0) > 0;
  return <div className="grid gap-5"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Analytics</p><h1 className="text-4xl font-semibold tracking-tighter">Scan intelligence</h1><p className="mt-2 text-zinc-500">Real scan, device, campaign split, and conversion data appears after your first QR is scanned.</p></div><AnalyticsCharts hasData={hasData}/><QrTable/></div>;
}
