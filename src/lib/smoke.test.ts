import { describe, expect, test } from "vitest";
import { smokeTargets, validateSmokeResponse } from "./smoke";

describe("production smoke checks", () => {
  test("builds stable targets from a deployment base URL", () => {
    expect(smokeTargets("https://qrspark.example/")).toEqual([
      { name: "health", url: "https://qrspark.example/api/health", requireOkJson: true },
      { name: "home", url: "https://qrspark.example/", requireSecurityHeaders: true },
      { name: "pricing", url: "https://qrspark.example/pricing", requireSecurityHeaders: true },
    ]);
  });

  test("accepts healthy JSON health responses", async () => {
    const response = new Response(JSON.stringify({ ok: true, missing: [], contract: "qrspark-health-v1" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

    await expect(validateSmokeResponse("health", response, { requireOkJson: true })).resolves.toBeUndefined();
  });

  test("rejects stale health responses without the production readiness contract", async () => {
    const response = new Response(JSON.stringify({ ok: true, service: "qrspark" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

    await expect(validateSmokeResponse("health", response, { requireOkJson: true })).rejects.toThrow(
      "health readiness payload did not match qrspark-health-v1",
    );
  });

  test("rejects health responses whose JSON readiness is false", async () => {
    const response = new Response(JSON.stringify({ ok: false }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });

    await expect(validateSmokeResponse("health", response, { requireOkJson: true })).rejects.toThrow(
      "health returned status 503",
    );
  });

  test("requires core security headers on public pages", async () => {
    const response = new Response("<html></html>", {
      status: 200,
      headers: {
        "content-security-policy": "default-src 'self'",
        "x-frame-options": "DENY",
        "x-content-type-options": "nosniff",
      },
    });

    await expect(validateSmokeResponse("home", response, { requireSecurityHeaders: true })).resolves.toBeUndefined();
  });

  test("rejects public pages that disclose the framework in response headers", async () => {
    const response = new Response("<html></html>", {
      status: 200,
      headers: {
        "content-security-policy": "default-src 'self'",
        "x-frame-options": "DENY",
        "x-content-type-options": "nosniff",
        "x-powered-by": "Next.js",
      },
    });

    await expect(validateSmokeResponse("home", response, { requireSecurityHeaders: true })).rejects.toThrow(
      "home must not expose x-powered-by",
    );
  });

  test("rejects pages missing security headers", async () => {
    const response = new Response("<html></html>", { status: 200 });

    await expect(validateSmokeResponse("home", response, { requireSecurityHeaders: true })).rejects.toThrow(
      "home missing content-security-policy",
    );
  });
});
