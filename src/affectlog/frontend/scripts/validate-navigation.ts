/**
 * Validate public nav, console nav, and footer nav against registries.
 * Run: npx tsx scripts/validate-navigation.ts
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "../src");

const routesSrc  = readFileSync(join(SRC, "routing/routes.ts"), "utf-8");
const linksSrc   = readFileSync(join(SRC, "links/externalLinks.ts"), "utf-8");
const pubNavSrc  = readFileSync(join(SRC, "navigation/publicNav.ts"), "utf-8");
const footerSrc  = readFileSync(join(SRC, "navigation/footerNav.ts"), "utf-8");
const consoleSrc = readFileSync(join(SRC, "navigation/consoleNav.ts"), "utf-8");

const errors: string[] = [];

const routePaths = new Set(
  [...routesSrc.matchAll(/^\s+path:\s*["']([^"'${}\n]+)["']/gm)].map((m) => m[1])
);
const externalIds = new Set(
  [...linksSrc.matchAll(/^\s+id:\s*["']([^"'${}\n]+)["']/gm)].map((m) => m[1])
);

function validateInternalPaths(src: string, fileName: string) {
  const matches = [...src.matchAll(/to:\s*["'`](\/[^"'`\s]+)["'`]/g)];
  for (const m of matches) {
    const path = m[1];
    if (!routePaths.has(path)) {
      errors.push(`${fileName}: internal path "${path}" not in route registry`);
    }
  }
}

function validateExternalIds(src: string, fileName: string) {
  const matches = [...src.matchAll(/externalId:\s*["'`]([^"'`]+)["'`]/g)];
  for (const m of matches) {
    const id = m[1];
    if (!externalIds.has(id)) {
      errors.push(`${fileName}: externalId "${id}" not in externalLinks registry`);
    }
  }
}

validateInternalPaths(pubNavSrc, "publicNav.ts");
validateExternalIds(pubNavSrc, "publicNav.ts");
validateInternalPaths(footerSrc, "footerNav.ts");
validateExternalIds(footerSrc, "footerNav.ts");
validateInternalPaths(consoleSrc, "consoleNav.ts");

// Max 6 top-level nav groups
const groupCount = [...pubNavSrc.matchAll(/type:\s*["'`]group["'`]/g)].length;
if (groupCount > 6) {
  errors.push(`publicNav.ts has ${groupCount} top-level groups — maximum is 6`);
}

// No href="#"
for (const [name, src] of [["publicNav.ts", pubNavSrc], ["footerNav.ts", footerSrc], ["consoleNav.ts", consoleSrc]]) {
  if ((src as string).includes('href="#"')) errors.push(`${name}: found href="#"`);
}

// No forbidden terms
const FORBIDDEN = ["lorem ipsum", "TODO", "coming soon", "placeholder", "D3.7", "TRL"];
for (const [name, src] of [["publicNav.ts", pubNavSrc], ["footerNav.ts", footerSrc]]) {
  for (const term of FORBIDDEN) {
    if ((src as string).toLowerCase().includes(term.toLowerCase())) {
      errors.push(`${name}: forbidden term "${term}"`);
    }
  }
}

if (errors.length > 0) {
  console.error("NAVIGATION VALIDATION ERRORS:");
  errors.forEach((e) => console.error(`  ✗  ${e}`));
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
} else {
  console.log(`✓ Navigation validation passed`);
  console.log(`  Public nav groups: ${groupCount}/6`);
  console.log(`  Route paths: ${routePaths.size} | External IDs: ${externalIds.size}`);
}
