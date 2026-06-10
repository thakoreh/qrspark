#!/usr/bin/env node
import { runSmokeChecks } from "../src/lib/smoke.ts";

const baseUrl = process.env.SMOKE_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || process.argv[2];

if (!baseUrl) {
  console.error("Set SMOKE_BASE_URL or NEXT_PUBLIC_APP_URL, or pass a base URL argument.");
  process.exit(2);
}

try {
  const results = await runSmokeChecks(baseUrl);
  for (const result of results) {
    console.log(`${result.name}: ${result.status} ${result.url}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
