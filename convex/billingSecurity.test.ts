import { describe, expect, test } from "vitest";
import { assertBillingSyncSecret, assertServerMutationSecret } from "./billingSecurity";

describe("billing sync security", () => {
  test("rejects billing updates when no server secret is configured", () => {
    expect(() => assertBillingSyncSecret("provided", undefined)).toThrow("Billing sync secret is not configured");
  });

  test("rejects billing updates with the wrong server secret", () => {
    expect(() => assertBillingSyncSecret("wrong", "expected")).toThrow("Billing sync secret is invalid");
  });

  test("allows billing updates with the configured server secret", () => {
    expect(assertBillingSyncSecret("expected", "expected")).toEqual({ ok: true });
  });
});

describe("server mutation security", () => {
  test("rejects server mutations when no shared secret is configured", () => {
    expect(() => assertServerMutationSecret("provided", undefined)).toThrow("Server mutation secret is not configured");
  });

  test("rejects server mutations with the wrong shared secret", () => {
    expect(() => assertServerMutationSecret("wrong", "expected")).toThrow("Server mutation secret is invalid");
  });

  test("allows server mutations with the configured shared secret", () => {
    expect(assertServerMutationSecret("expected", "expected")).toEqual({ ok: true });
  });
});
