import { z } from "zod";

const slugPattern = /[^a-z0-9_-]+/g;

export function sanitizePublicSlug(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(slugPattern, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

const conversionSchema = z.object({
  slug: z.preprocess(sanitizePublicSlug, z.string().min(1).max(120)),
  event: z
    .preprocess((value) => String(value ?? "conversion").trim().slice(0, 80), z.string().min(1).max(80))
    .default("conversion"),
  value: z.number().finite().nonnegative().optional(),
});

export type ConversionPayload = z.infer<typeof conversionSchema>;

export function parseConversionPayload(payload: unknown) {
  return conversionSchema.safeParse(payload);
}

export function safeRedirectDestination(destination: string | undefined | null) {
  if (!destination) return null;
  try {
    const url = new URL(destination);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url;
  } catch {
    return null;
  }
}
