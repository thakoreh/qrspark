export type PlanId = "free" | "starter" | "pro" | "team";
export type StoredQrKind = "static" | "dynamic";

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

export function qrDestinationIsAllowed(kind: StoredQrKind, destinationUrl: string) {
  if (kind === "static") return destinationUrl.trim().length > 0 && destinationUrl.length <= 4096;
  try {
    const url = new URL(destinationUrl);
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
