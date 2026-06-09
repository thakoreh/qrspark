import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return [
    "/",
    "/generator",
    "/use-cases",
    "/dynamic-qr-codes",
    "/analytics",
    "/trust",
    "/pricing",
    "/auth",
    "/dashboard/create",
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}
