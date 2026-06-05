/**
 * Validate that all external links are registered in externalLinks.ts
 * and that no raw external URLs are hardcoded in components.
 * Run: npx tsx scripts/validate-links.ts
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, "../src");
const EXTERNAL_LINKS_FILE = join(SRC_DIR, "links/externalLinks.ts");

const errors: string[] = [];

// Extract all registered URLs from externalLinks.ts
const linksSrc = readFileSync(EXTERNAL_LINKS_FILE, "utf-8");
const registeredUrls = new Set(
  [...linksSrc.matchAll(/url:\s*["'`](https?:\/\/[^"'`]+)["'`]/g)].map((m) => m[1])
);
console.log(`Registered external URLs: ${registeredUrls.size}`);

// Walk all .tsx/.ts files
function walkFiles(dir: string): string[] {
  const results: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === "scripts") continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkFiles(full));
    } else if ([".ts", ".tsx"].includes(extname(full))) {
      results.push(full);
    }
  }
  return results;
}

const files = walkFiles(SRC_DIR);
const ALLOWED_FILES = [EXTERNAL_LINKS_FILE];
const URL_PATTERN = /["'`](https?:\/\/(?!localhost)[^"'`\s]+)["'`]/g;

// Domains/prefixes that are not end-user links and should not be in the registry
const EXEMPT_PREFIXES = [
  "http://www.w3.org/",   // SVG/XML namespaces
  "http://schema.org/",   // Schema.org structured data
  "http://purl.org/",     // Dublin Core / PURL
  "http://model-service", // Internal Docker service names
  "http://localhost",
  "https://localhost",
];

for (const file of files) {
  if (ALLOWED_FILES.includes(file)) continue;
  const src = readFileSync(file, "utf-8");
  const lines = src.split("\n");
  const matches = [...src.matchAll(URL_PATTERN)];
  for (const m of matches) {
    const url = m[1];
    if (EXEMPT_PREFIXES.some((p) => url.startsWith(p))) continue;
    const lineNo = src.substring(0, m.index!).split("\n").length;
    const line = lines[lineNo - 1] ?? "";
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;
    const normalized = url.endsWith("/") ? url : url + "/";
    const inRegistry = registeredUrls.has(url) || registeredUrls.has(normalized) ||
      [...registeredUrls].some((r) => r.startsWith(url) || url.startsWith(r));
    if (!inRegistry) {
      errors.push(`Unregistered external URL in ${file.replace(SRC_DIR, "src")}:${lineNo}\n      URL: ${url}`);
    }
  }
}

// Check href="#" and javascript:void
for (const file of files) {
  const src = readFileSync(file, "utf-8");
  if (src.includes('href="#"')) {
    errors.push(`Found href="#" in ${file.replace(SRC_DIR, "src")}`);
  }
  if (src.includes("javascript:void")) {
    errors.push(`Found javascript:void in ${file.replace(SRC_DIR, "src")}`);
  }
}

if (errors.length > 0) {
  console.error("\nLINK VALIDATION ERRORS:");
  errors.forEach((e) => console.error(`  ✗  ${e}`));
  console.error(`\n${errors.length} error(s). All external URLs must be in links/externalLinks.ts`);
  process.exit(1);
} else {
  console.log(`✓ Link validation passed (${files.length} files scanned, ${registeredUrls.size} URLs registered)`);
}
