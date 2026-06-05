/**
 * Validate the sitemap.xml against expected public routes.
 * Run: npx tsx scripts/validate-sitemap.ts
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITEMAP_PATH = join(__dirname, "../public/sitemap.xml");
const errors: string[] = [];

const EXPECTED_PATHS = [
  "/", "/product", "/guided-assessment", "/dataset-audit",
  "/model-assessment", "/compliance-exports", "/community", "/cloud",
  "/pricing", "/security", "/developers", "/docs", "/ecosystem",
  "/openapi", "/self-host", "/request-access",
];

const FORBIDDEN_IN_SITEMAP = [
  "/login", "/register", "/app", "/admin", "/platform",
  "/activate", "/forgot-password", "/reset-password",
];

if (!existsSync(SITEMAP_PATH)) {
  console.error("✗ sitemap.xml not found at public/sitemap.xml");
  process.exit(1);
}

const sitemap = readFileSync(SITEMAP_PATH, "utf-8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
  const url = m[1].trim();
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
});

console.log(`Sitemap URLs: ${locs.length}`);

for (const path of EXPECTED_PATHS) {
  if (!locs.includes(path)) {
    errors.push(`Expected path missing from sitemap: "${path}"`);
  }
}

for (const path of FORBIDDEN_IN_SITEMAP) {
  if (locs.some((l) => l === path || l.startsWith(path + "/"))) {
    errors.push(`Forbidden path in sitemap: "${path}"`);
  }
}

if (errors.length > 0) {
  console.error("SITEMAP VALIDATION ERRORS:");
  errors.forEach((e) => console.error(`  ✗  ${e}`));
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
} else {
  console.log(`✓ Sitemap validation passed (${locs.length} URLs, ${EXPECTED_PATHS.length} required paths verified)`);
}
