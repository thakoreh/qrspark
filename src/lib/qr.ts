export type QrKind = "url" | "text" | "wifi" | "vcard" | "email" | "sms" | "phone";

export function payloadFor(kind: QrKind, values: Record<string, string>) {
  if (kind === "wifi") return `WIFI:T:${values.encryption || "WPA"};S:${values.ssid || ""};P:${values.password || ""};;`;
  if (kind === "vcard") return `BEGIN:VCARD
VERSION:3.0
FN:${values.name || ""}
ORG:${values.company || ""}
TEL:${values.phone || ""}
EMAIL:${values.email || ""}
URL:${values.url || ""}
END:VCARD`;
  if (kind === "email") return `mailto:${values.email || ""}?subject=${encodeURIComponent(values.subject || "")}&body=${encodeURIComponent(values.body || "")}`;
  if (kind === "sms") return `SMSTO:${values.phone || ""}:${values.message || ""}`;
  if (kind === "phone") return `tel:${values.phone || ""}`;
  return values.content || values.url || "https://qrspark.io";
}

export function weightedDestination(destinations: { url: string; weight: number }[]) {
  const clean = destinations.filter((item) => item.url && item.weight > 0);
  const total = clean.reduce((sum, item) => sum + item.weight, 0) || 1;
  let cursor = Math.random() * total;
  for (const item of clean) {
    cursor -= item.weight;
    if (cursor <= 0) return item.url;
  }
  return clean[0]?.url || "https://qrspark.io";
}
