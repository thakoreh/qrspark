export function assertBillingSyncSecret(provided?: string, configured = process.env.BILLING_SYNC_SECRET) {
  const expected = configured?.trim();
  if (!expected) throw new Error("Billing sync secret is not configured");
  if (provided !== expected) throw new Error("Billing sync secret is invalid");
  return { ok: true };
}

export function assertServerMutationSecret(provided?: string, configured = process.env.CONVEX_SERVER_MUTATION_SECRET) {
  const expected = configured?.trim();
  if (!expected) throw new Error("Server mutation secret is not configured");
  if (provided !== expected) throw new Error("Server mutation secret is invalid");
  return { ok: true };
}
