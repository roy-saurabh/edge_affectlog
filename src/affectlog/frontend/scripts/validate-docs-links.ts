/**
 * Validate that docs links in the frontend point to existing markdown files.
 * Run: npx tsx scripts/validate-docs-links.ts
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, "../../../../docs");
const SRC_DIR  = join(__dirname, "../src");
const errors: string[] = [];

function listDocs(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      results.push(...listDocs(full));
    } else {
      results.push(full.replace(DOCS_DIR + "/", ""));
    }
  }
  return results;
}

const docsFiles = new Set(listDocs(DOCS_DIR));
console.log(`Docs files found: ${docsFiles.size}`);

// Required docs
const REQUIRED_DOCS = [
  "index.md",
  "api.md",
  "openapi.yaml",
  "guided-analysis-wizard.md",
  "capability-registry.md",
  "privacy-and-security.md",
  "carisma-lola-interoperability.md",
  "data-governance.md",
];

for (const required of REQUIRED_DOCS) {
  if (!docsFiles.has(required)) {
    errors.push(`Required docs file missing: docs/${required}`);
  }
}

function walkFiles(dir: string): string[] {
  const results: string[] = [];
  for (const name of readdirSync(dir)) {
    if (["node_modules", "dist", "scripts"].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      results.push(...walkFiles(full));
    } else if ([".ts", ".tsx"].includes(extname(full))) {
      results.push(full);
    }
  }
  return results;
}

const files = walkFiles(SRC_DIR);
for (const file of files) {
  const src = readFileSync(file, "utf-8");
  const matches = [...src.matchAll(/["'`]((?:\/docs\/|docs\/)([^"'`\s?#]+))["'`]/g)];
  for (const m of matches) {
    const docPath = m[2];
    if (!docsFiles.has(docPath)) {
      const lineNo = src.substring(0, m.index!).split("\n").length;
      errors.push(`${file.replace(SRC_DIR, "src")}:${lineNo} — docs link to missing: docs/${docPath}`);
    }
  }
}

if (errors.length > 0) {
  console.error("DOCS LINK VALIDATION ERRORS:");
  errors.forEach((e) => console.error(`  ✗  ${e}`));
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
} else {
  console.log(`✓ Docs link validation passed (${docsFiles.size} docs files, ${files.length} source files scanned)`);
}
