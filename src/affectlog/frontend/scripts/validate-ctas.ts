/**
 * Validate CTA registry integrity.
 * Run: npx tsx scripts/validate-ctas.ts
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "../src");

const ctaSrc   = readFileSync(join(SRC, "cta/ctaRegistry.ts"), "utf-8");
const routesSrc = readFileSync(join(SRC, "routing/routes.ts"), "utf-8");
const linksSrc  = readFileSync(join(SRC, "links/externalLinks.ts"), "utf-8");

const errors: string[] = [];

const routeIds = new Set(
  [...routesSrc.matchAll(/^\s+id:\s*["']([^"'${}\n]+)["']/gm)].map((m) => m[1])
);
const externalIds = new Set(
  [...linksSrc.matchAll(/^\s+id:\s*["']([^"'${}\n]+)["']/gm)].map((m) => m[1])
);

const ctaIds      = [...ctaSrc.matchAll(/^\s+id:\s*["']([^"'${}\n]+)["']/gm)].map((m) => m[1]);
const ctaLabels   = [...ctaSrc.matchAll(/^\s+label:\s*["']([^"'${}\n]+)["']/gm)].map((m) => m[1]);
const ctaPurposes = [...ctaSrc.matchAll(/^\s+purpose:\s*["']([^"'${}\n]+)["']/gm)].map((m) => m[1]);
const ctaTargetTypes = [...ctaSrc.matchAll(/^\s+targetType:\s*["']([^"'${}\n]+)["']/gm)].map((m) => m[1]);
const ctaTargetIds   = [...ctaSrc.matchAll(/^\s+targetId:\s*["']([^"'${}\n]+)["']/gm)].map((m) => m[1]);

// Unique ids
const seenIds = new Set<string>();
for (const id of ctaIds) {
  if (seenIds.has(id)) errors.push(`Duplicate CTA id: "${id}"`);
  seenIds.add(id);
}

for (let i = 0; i < ctaIds.length; i++) {
  const id         = ctaIds[i];
  const label      = ctaLabels[i];
  const purpose    = ctaPurposes[i];
  const targetType = ctaTargetTypes[i];
  const targetId   = ctaTargetIds[i];

  if (!label?.trim()) errors.push(`CTA "${id}" has empty label`);
  if (!purpose?.trim()) errors.push(`CTA "${id}" has no purpose`);

  if (targetType === "route" && targetId && !routeIds.has(targetId)) {
    errors.push(`CTA "${id}" → unknown route id: "${targetId}"`);
  }
  if (targetType === "external" && targetId && !externalIds.has(targetId)) {
    errors.push(`CTA "${id}" → unknown external link id: "${targetId}"`);
  }
}

// Forbidden generic labels
const FORBIDDEN = ["learn more", "click here", "start", "explore", "go"];
for (const label of ctaLabels) {
  if (FORBIDDEN.includes(label?.toLowerCase())) {
    errors.push(`Forbidden generic CTA label: "${label}"`);
  }
}

if (errors.length > 0) {
  console.error("CTA VALIDATION ERRORS:");
  errors.forEach((e) => console.error(`  ✗  ${e}`));
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
} else {
  console.log(`✓ CTA validation passed (${seenIds.size} CTAs checked)`);
}
