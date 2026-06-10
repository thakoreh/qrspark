import { describe, expect, test } from "vitest";
import { adminEmailsFromEnv, isAdminEmail } from "./admin";

describe("admin access", () => {
  test("parses single and comma separated admin email env values", () => {
    expect(
      adminEmailsFromEnv({
        QRFORGE_ADMIN_EMAIL: "Owner@Example.com",
        QRFORGE_ADMIN_EMAILS: "ops@example.com, finance@example.com ",
      }),
    ).toEqual(["owner@example.com", "ops@example.com", "finance@example.com"]);
  });

  test("authorizes matching admin emails case-insensitively", () => {
    expect(isAdminEmail("OWNER@example.com", { QRFORGE_ADMIN_EMAIL: "owner@example.com" })).toBe(true);
  });

  test("does not authorize non-admin emails", () => {
    expect(isAdminEmail("user@example.com", { QRFORGE_ADMIN_EMAIL: "owner@example.com" })).toBe(false);
  });

  test("fails closed when no admin emails are configured", () => {
    expect(isAdminEmail("owner@example.com", {})).toBe(false);
  });
});
