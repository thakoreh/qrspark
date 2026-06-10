"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { analyticsChartsFromWorkspace, type WorkspaceAnalyticsCharts } from "@/lib/analytics";
import { Panel } from "@/components/ui";

export function AnalyticsCharts({ analytics, hasData = true }: { analytics?: WorkspaceAnalyticsCharts | null; hasData?: boolean }) {
  const { scanSeries, deviceStats, geoStats } = analyticsChartsFromWorkspace(analytics);

  if (!hasData) {
    return <Panel className="grid place-items-center px-6 py-12 text-center">
      <div className="max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Analytics unlock after first scan</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">No fake charts in your workspace.</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-500">Create a QR, place it on a flyer, menu, sign, or card, and QRSpark will show real scans, devices, destinations, and conversion events here.</p>
      </div>
    </Panel>;
  }

  if (!scanSeries.length && !deviceStats.length && !geoStats.length) {
    return <Panel className="grid place-items-center px-6 py-12 text-center">
      <div className="max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Analytics are live</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Chart breakdowns are collecting.</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-500">Totals are real. Time, device, and location charts appear after scan metadata is available from tracked QR traffic.</p>
      </div>
    </Panel>;
  }

  return <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
    <Panel className="min-h-[340px]"><div className="mb-6"><p className="text-sm font-medium text-zinc-500">Scans and conversions</p><h2 className="text-2xl font-semibold tracking-tight">Campaign signal by day</h2></div><ResponsiveContainer width="100%" height={240}><AreaChart data={scanSeries}><defs><linearGradient id="scans" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(113,113,122,0.2)"/><XAxis dataKey="day"/><YAxis/><Tooltip/><Area type="monotone" dataKey="scans" stroke="#10b981" fill="url(#scans)" strokeWidth={2}/><Area type="monotone" dataKey="conversions" stroke="#18181b" fill="transparent" strokeWidth={2}/></AreaChart></ResponsiveContainer></Panel>
    <Panel><div className="mb-4"><p className="text-sm font-medium text-zinc-500">Device mix</p><h2 className="text-2xl font-semibold tracking-tight">Scan context</h2></div><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={deviceStats} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={3}>{deviceStats.map((_, i) => <Cell key={i} fill={["#10b981", "#18181b", "#a1a1aa", "#6b7280"][i % 4]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="grid gap-2 text-sm">{deviceStats.map((item) => <div key={item.name} className="flex justify-between"><span>{item.name}</span><span className="font-semibold">{item.value} scans</span></div>)}</div></Panel>
    <Panel className="lg:col-span-2"><div className="mb-5"><p className="text-sm font-medium text-zinc-500">Locations</p><h2 className="text-2xl font-semibold tracking-tight">Top scan cities</h2></div><ResponsiveContainer width="100%" height={220}><BarChart data={geoStats}><CartesianGrid strokeDasharray="3 3" stroke="rgba(113,113,122,0.2)"/><XAxis dataKey="city"/><YAxis/><Tooltip/><Bar dataKey="scans" fill="#10b981" radius={[10,10,0,0]} /></BarChart></ResponsiveContainer></Panel>
  </div>;
}
