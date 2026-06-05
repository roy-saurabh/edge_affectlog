#!/usr/bin/env tsx
/**
 * Post-deployment smoke test.
 * Verifies critical public routes and API health after production deploy.
 *
 * Usage:
 *   DEPLOY_URL=https://your-domain.com tsx scripts/post-deploy-smoke-test.ts
 */

const BASE = process.env.DEPLOY_URL ?? "http://localhost:3000";
const API_BASE = process.env.API_URL ?? "http://localhost:8000";

const CRITICAL_ROUTES = [
  "/",
  "/product",
  "/community",
  "/cloud",
  "/request-access",
  "/login",
  "/docs",
  "/pricing",
  "/self-host",
];

const API_CHECKS = [
  { path: "/healthz",    expectStatus: 200 },
  { path: "/openapi.json", expectStatus: 200 },
];

async function checkUrl(url: string, expectedStatus = 200): Promise<{ ok: boolean; status: number; url: string }> {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(10000) });
    return { ok: res.status === expectedStatus, status: res.status, url };
  } catch (err) {
    return { ok: false, status: 0, url };
  }
}

async function main() {
  console.log(`\nPost-deploy smoke tests`);
  console.log(`Frontend: ${BASE}`);
  console.log(`API:      ${API_BASE}`);
  console.log("─".repeat(60));

  const results: { ok: boolean; status: number; url: string }[] = [];

  // Frontend routes
  console.log("\nFrontend routes:");
  for (const route of CRITICAL_ROUTES) {
    const result = await checkUrl(`${BASE}${route}`);
    const icon = result.ok ? "✓" : "✗";
    console.log(`  ${icon} [${result.status}] ${route}`);
    results.push(result);
  }

  // API endpoints
  console.log("\nAPI endpoints:");
  for (const { path, expectStatus } of API_CHECKS) {
    const result = await checkUrl(`${API_BASE}${path}`, expectStatus);
    const icon = result.ok ? "✓" : "✗";
    console.log(`  ${icon} [${result.status}] ${path}`);
    results.push(result);
  }

  const failures = results.filter((r) => !r.ok);
  console.log("\n" + "─".repeat(60));

  if (failures.length > 0) {
    console.error(`\n✗ ${failures.length} smoke test(s) FAILED:`);
    failures.forEach((f) => console.error(`    [${f.status}] ${f.url}`));
    process.exit(1);
  } else {
    console.log(`\n✓ All ${results.length} smoke tests passed`);
  }
}

main().catch((err) => {
  console.error("Smoke test runner error:", err);
  process.exit(1);
});
