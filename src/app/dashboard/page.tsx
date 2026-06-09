import { ChartLineUp, FolderSimple, QrCode, Users } from "@phosphor-icons/react/dist/ssr";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { QrTable } from "@/components/qr-table";
import { Panel } from "@/components/ui";
import { demoQrs } from "@/lib/demo-data";

export default function DashboardPage() {
  const totalScans = demoQrs.reduce((sum, row) => sum + row.scans, 0);
  const stats = [[QrCode,"QR codes",demoQrs.length],[ChartLineUp,"Total scans",totalScans],[Users,"Unique scans",3058],[FolderSimple,"Folders",4]] as const;
  return <div className="grid gap-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Dashboard</p><h1 className="text-4xl font-semibold tracking-tighter">Campaign workspace</h1></div><a href="/dashboard/create" className="inline-flex min-h-10 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">Create QR</a></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([Icon,label,value])=><Panel key={label}><Icon size={24} className="text-emerald-600"/><p className="mt-5 text-3xl font-semibold">{value.toLocaleString()}</p><p className="text-sm text-zinc-500">{label}</p></Panel>)}</div><AnalyticsCharts/><QrTable/></div>;
}
