export type SmokeTarget = {
  name: string;
  url: string;
  requireOkJson?: boolean;
  requireSecurityHeaders?: boolean;
};

const healthContract = "qrspark-health-v1";

const requiredSecurityHeaders = [
  "content-security-policy",
  "x-frame-options",
  "x-content-type-options",
];

const forbiddenSecurityHeaders = [
  "x-powered-by",
];

export function smokeTargets(baseUrl: string): SmokeTarget[] {
  const base = new URL(baseUrl);
  return [
    { name: "health", url: new URL("/api/health", base).toString(), requireOkJson: true },
    { name: "home", url: new URL("/", base).toString(), requireSecurityHeaders: true },
    { name: "pricing", url: new URL("/pricing", base).toString(), requireSecurityHeaders: true },
  ];
}

export async function validateSmokeResponse(
  name: string,
  response: Response,
  options: Pick<SmokeTarget, "requireOkJson" | "requireSecurityHeaders"> = {},
) {
  if (!response.ok) {
    throw new Error(`${name} returned status ${response.status}`);
  }

  if (options.requireOkJson) {
    const payload = await response.json().catch(() => null);
    if (!payload || payload.ok !== true) {
      throw new Error(`${name} readiness payload was not ok`);
    }
    if (payload.contract !== healthContract || !Array.isArray(payload.missing)) {
      throw new Error(`${name} readiness payload did not match ${healthContract}`);
    }
  }

  if (options.requireSecurityHeaders) {
    for (const header of requiredSecurityHeaders) {
      if (!response.headers.get(header)) {
        throw new Error(`${name} missing ${header}`);
      }
    }
    for (const header of forbiddenSecurityHeaders) {
      if (response.headers.get(header)) {
        throw new Error(`${name} must not expose ${header}`);
      }
    }
  }
}

export async function runSmokeChecks(baseUrl: string, fetcher: typeof fetch = fetch) {
  const results = [];
  for (const target of smokeTargets(baseUrl)) {
    const response = await fetcher(target.url, { redirect: "manual" });
    await validateSmokeResponse(target.name, response, target);
    results.push({ name: target.name, status: response.status, url: target.url });
  }
  return results;
}
