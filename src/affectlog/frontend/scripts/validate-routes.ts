/**
 * Validate that all routes in the registry are well-formed.
 * Run: npx tsx scripts/validate-routes.ts
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const routesPath = join(__dirname, "../src/routing/routes.ts");
const routesSrc = readFileSync(routesPath, "utf-8");

const errors: string[] = [];

// Extract all path fields
const pathMatches = [...routesSrc.matchAll(/path:\s*["'`]([^"'`]+)["'`]/g)];
const paths = pathMatches.map((m) => m[1]);

const FORBIDDEN_PATHS = ["/todo", "/coming-soon", "/placeholder", "/wip"];

const seen = new Set<string>();
for (const path of paths) {
  if (!path.startsWith("/")) {
    errors.push(`Route path "${path}" does not start with /`);
  }
  if (seen.has(path)) {
    errors.push(`Duplicate route path: "${path}"`);
  }
  seen.add(path);
  if (FORBIDDEN_PATHS.some((f) => path.startsWith(f))) {
    errors.push(`Forbidden placeholder path: "${path}"`);
  }
}

// Check id uniqueness — match only plain string literals (not template expressions)
const idMatches = [...routesSrc.matchAll(/^\s+id:\s*["']([^"'${}\n]+)["']/gm)];
const ids = idMatches.map((m) => m[1]);
const seenIds = new Set<string>();
for (const id of ids) {
  if (seenIds.has(id)) {
    errors.push(`Duplicate route id: "${id}"`);
  }
  seenIds.add(id);
}

// Check all page component imports in App.tsx exist
const appPath = join(__dirname, "../src/App.tsx");
const appSrc = readFileSync(appPath, "utf-8");
const importMatches = [...appSrc.matchAll(/import\("\.\/pages\/([^"]+)"\)/g)];
for (const match of importMatches) {
  const abs = join(__dirname, `../src/pages/${match[1]}.tsx`);
  if (!existsSync(abs)) {
    errors.push(`App.tsx lazy import missing: ./pages/${match[1]}.tsx`);
  }
}

// No href="#" or javascript:void
for (const [label, src] of [["routes.ts", routesSrc], ["App.tsx", appSrc]]) {
  if ((src as string).includes('href="#"')) {
    errors.push(`Found href="#" in ${label}`);
  }
  if ((src as string).includes("javascript:void")) {
    errors.push(`Found javascript:void in ${label}`);
  }
}

if (errors.length > 0) {
  console.error("ROUTE VALIDATION ERRORS:");
  errors.forEach((e) => console.error(`  ✗  ${e}`));
  console.error(`\n${errors.length} error(s). Fix before deploying.`);
  process.exit(1);
} else {
  console.log(`✓ Route validation passed (${ids.length} routes, ${paths.length} paths)`);
}
