export type PlanId = "free" | "starter" | "pro" | "team";
export type StoredQrKind = "static" | "dynamic";

const maxQrDestinationLength = 4096;
const defaultQrName = "Untitled QR campaign";
const defaultFolderName = "General";
const defaultQrStyle = {
  foreground: "#111827",
  background: "#ffffff",
  shape: "rounded",
};
const allowedQrShapes = new Set(["rounded", "dots", "minimal", "poster"]);
const dataImageLogoPattern = /^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=\s]+$/i;

const limits: Record<PlanId, { dynamic: number; static: number; aiCredits: number }> = {
  free: { dynamic: 1, static: 10, aiCredits: 3 },
  starter: { dynamic: 3, static: -1, aiCredits: 25 },
  pro: { dynamic: -1, static: -1, aiCredits: 250 },
  team: { dynamic: -1, static: -1, aiCredits: 1000 },
};

export function normalizeQrSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function normalizeQrName(value: string) {
  return value.trim().slice(0, 120) || defaultQrName;
}

export function normalizeFolderName(value?: string) {
  return value?.trim().slice(0, 80) || defaultFolderName;
}

function normalizeHexColor(value: string | undefined, fallback: string) {
  const color = value?.trim().toLowerCase();
  if (!color || !/^#[0-9a-f]{6}$/.test(color)) return fallback;
  return color;
}

function normalizeLogoUrl(value: string | undefined) {
  const logoUrl = value?.trim();
  if (!logoUrl || logoUrl.length > 50_000) return undefined;
  if (logoUrl.startsWith("https://")) return logoUrl;
  if (dataImageLogoPattern.test(logoUrl)) return logoUrl;
  return undefined;
}

export function normalizeQrStyle(
  style?: Partial<{ foreground: string; background: string; shape: string; logoUrl: string }>,
) {
  const shape = style?.shape?.trim().toLowerCase();
  const logoUrl = normalizeLogoUrl(style?.logoUrl);
  return {
    foreground: normalizeHexColor(style?.foreground, defaultQrStyle.foreground),
    background: normalizeHexColor(style?.background, defaultQrStyle.background),
    shape: shape && allowedQrShapes.has(shape) ? shape : defaultQrStyle.shape,
    ...(logoUrl ? { logoUrl } : {}),
  };
}

export function qrDestinationIsAllowed(kind: StoredQrKind, destinationUrl: string) {
  const destination = destinationUrl.trim();
  if (!destination || destination.length > maxQrDestinationLength) return false;
  if (kind === "static") return true;
  try {
    const url = new URL(destination);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function assertCanCreateQr(args: {
  plan: PlanId;
  kind: StoredQrKind;
  existingDynamic: number;
  existingStatic: number;
}) {
  const planLimits = limits[args.plan] ?? limits.free;
  const limit = planLimits[args.kind];
  const current = args.kind === "dynamic" ? args.existingDynamic : args.existingStatic;

  if (limit !== -1 && current >= limit) {
    const label = args.kind === "dynamic" ? "Dynamic QR" : "Static QR";
    throw new Error(`${label} limit reached for the ${args.plan} plan`);
  }

  return { ok: true };
}

export function assertCanDuplicateQr(args: {
  plan: PlanId;
  kind: StoredQrKind;
  existingDynamic: number;
  existingStatic: number;
}) {
  return assertCanCreateQr(args);
}

export function assertCanDeleteCampaignQr() {
  throw new Error("Campaign QR deletion is disabled to preserve analytics history and plan limits");
}

export function assertCanUseAiCredit(args: {
  plan: PlanId;
  aiCreditsUsed: number;
  credits?: number;
}) {
  const planLimits = limits[args.plan] ?? limits.free;
  const credits = args.credits ?? 1;
  if (credits < 1 || !Number.isFinite(credits)) throw new Error("AI credit amount is invalid");

  if (planLimits.aiCredits !== -1 && args.aiCreditsUsed + credits > planLimits.aiCredits) {
    throw new Error(`AI credit limit reached for the ${args.plan} plan`);
  }

  return { ok: true };
}
