import { AnalyticsCharts } from "@/components/analytics-charts";
import { QrTable } from "@/components/qr-table";
export default function AnalyticsPage(){return <div className="grid gap-5"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Analytics</p><h1 className="text-4xl font-semibold tracking-tighter">Scan intelligence</h1><p className="mt-2 text-zinc-500">Unique scans, locations, devices, campaign split tests, and conversion events.</p></div><AnalyticsCharts/><QrTable/></div>}
