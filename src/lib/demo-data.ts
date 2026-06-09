export const demoQrs = [
  { id: "qr_1", name: "Cafe loyalty launch", type: "dynamic", folder: "Retail", scans: 1247, unique: 982, destination: "https://example.com/latte", status: "active", created_at: "2026-06-01", conversionRate: 7.8 },
  { id: "qr_2", name: "Open house lead card", type: "dynamic", folder: "Real estate", scans: 468, unique: 391, destination: "https://example.com/open-house", status: "active", created_at: "2026-06-04", conversionRate: 12.4 },
  { id: "qr_3", name: "WiFi front desk", type: "static", folder: "Operations", scans: 219, unique: 174, destination: "WIFI:S:QRSpark Guest;T:WPA;P:welcome2026;;", status: "active", created_at: "2026-05-24", conversionRate: 0 },
  { id: "qr_4", name: "Menu test split", type: "dynamic", folder: "Restaurant", scans: 1875, unique: 1511, destination: "https://example.com/menu", status: "active", created_at: "2026-05-17", conversionRate: 9.2 },
];

export const scanSeries = [
  { day: "Mon", scans: 188, unique: 141, conversions: 12 },
  { day: "Tue", scans: 241, unique: 194, conversions: 19 },
  { day: "Wed", scans: 236, unique: 187, conversions: 22 },
  { day: "Thu", scans: 318, unique: 259, conversions: 29 },
  { day: "Fri", scans: 406, unique: 331, conversions: 34 },
  { day: "Sat", scans: 522, unique: 417, conversions: 41 },
  { day: "Sun", scans: 381, unique: 298, conversions: 27 },
];

export const deviceStats = [
  { name: "iOS", value: 46 },
  { name: "Android", value: 39 },
  { name: "Desktop", value: 15 },
];

export const geoStats = ["Toronto", "Chicago", "Austin", "Vancouver", "New York"].map((city, index) => ({ city, scans: [428, 311, 264, 211, 186][index] }));
