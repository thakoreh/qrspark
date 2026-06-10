export type ScanSeriesRow = {
  day: string;
  scans: number;
  conversions: number;
};

export type DeviceStatRow = {
  name: string;
  value: number;
};

export type GeoStatRow = {
  city: string;
  scans: number;
};

export type WorkspaceAnalyticsCharts = {
  scanSeries?: ScanSeriesRow[];
  deviceStats?: DeviceStatRow[];
  geoStats?: GeoStatRow[];
};

export function analyticsChartsFromWorkspace(analytics?: WorkspaceAnalyticsCharts | null) {
  return {
    scanSeries: analytics?.scanSeries ?? [],
    deviceStats: analytics?.deviceStats ?? [],
    geoStats: analytics?.geoStats ?? [],
  };
}
