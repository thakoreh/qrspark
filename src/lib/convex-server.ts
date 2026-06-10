import { ConvexHttpClient } from "convex/browser";
import { getPublicConvexUrl } from "./env";

export function getConvexHttpClient(options: { authToken?: string | null } = {}) {
  const client = new ConvexHttpClient(getPublicConvexUrl());
  if (options.authToken) client.setAuth(options.authToken);
  return client;
}

export function getServerMutationSecret() {
  const secret = process.env.CONVEX_SERVER_MUTATION_SECRET?.trim();
  if (!secret) throw new Error("CONVEX_SERVER_MUTATION_SECRET is not configured");
  return secret;
}
