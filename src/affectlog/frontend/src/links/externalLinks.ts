import type { ExternalLink } from "./linkTypes";

// ── Canonical external link definitions ──────────────────────────────────────
// All external URLs used anywhere in the app MUST be registered here.
// No component may hardcode an external URL outside this file.

const LINKS: ExternalLink[] = [
  {
    id: "PROMETHEUS_X_HOME",
    label: "Prometheus-X",
    url: "https://prometheus-x.org/",
    owner: "Prometheus-X",
    purpose: "Main Prometheus-X ecosystem homepage",
    expectedStatus: 200,
    publicSafe: true,
  },
  {
    id: "PROMETHEUS_X_TRUSTWORTHY_AI",
    label: "Prometheus-X Trustworthy AI Assessment",
    url: "https://prometheus-x.org/bb04-trustworthy-ai-assessment/",
    owner: "Prometheus-X",
    purpose: "BB04 building block overview — Trustworthy AI Assessment",
    expectedStatus: 200,
    publicSafe: true,
  },
  {
    id: "PROMETHEUS_X_TAI_DOCS",
    label: "Technical BB04 Docs",
    url: "https://prometheus-x-association.github.io/docs/t-ai/",
    owner: "Prometheus-X",
    purpose: "Technical documentation for the t-ai building block",
    expectedStatus: 200,
    publicSafe: true,
  },
  {
    id: "EDGE_SKILLS_EC_PROJECT",
    label: "EDGE-Skills EU Project",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/how-to-participate/org-details/883807838/project/101123471/program/43152860/details",
    owner: "European Commission",
    purpose: "EDGE-Skills Digital Europe Programme project page (grant 101123471)",
    expectedStatus: 200,
    publicSafe: true,
  },
  {
    id: "AFFECTLOG_REPO",
    label: "GitHub Repository",
    url: "https://github.com/Prometheus-X-association/t-ai-affectlog",
    owner: "GitHub",
    purpose: "AffectLog source code, issues, and discussions",
    expectedStatus: 200,
    publicSafe: true,
  },
  {
    id: "AFFECTLOG_ISSUES",
    label: "GitHub Issues",
    url: "https://github.com/Prometheus-X-association/t-ai-affectlog/issues",
    owner: "GitHub",
    purpose: "Bug reports, feature requests, and discussions",
    expectedStatus: 200,
    publicSafe: true,
  },
  {
    id: "AFFECTLOG_SECURITY",
    label: "Security Policy",
    url: "https://github.com/Prometheus-X-association/t-ai-affectlog/security",
    owner: "GitHub",
    purpose: "Responsible disclosure and security advisories",
    expectedStatus: 200,
    publicSafe: true,
  },
  {
    id: "AFFECTLOG_CONTRIBUTING",
    label: "Contributor Guide",
    url: "https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/CONTRIBUTING.md",
    owner: "GitHub",
    purpose: "How to add recipes, adapters, and contribute code",
    expectedStatus: 200,
    publicSafe: true,
  },
  {
    id: "AFFECTLOG_LICENSE",
    label: "MIT License",
    url: "https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/LICENSE",
    owner: "GitHub",
    purpose: "MIT open-source license for the Community Edition",
    expectedStatus: 200,
    publicSafe: true,
  },
];

export const EXTERNAL_LINKS = Object.fromEntries(LINKS.map((l) => [l.id, l])) as Record<
  | "PROMETHEUS_X_HOME"
  | "PROMETHEUS_X_TRUSTWORTHY_AI"
  | "PROMETHEUS_X_TAI_DOCS"
  | "EDGE_SKILLS_EC_PROJECT"
  | "AFFECTLOG_REPO"
  | "AFFECTLOG_ISSUES"
  | "AFFECTLOG_SECURITY"
  | "AFFECTLOG_CONTRIBUTING"
  | "AFFECTLOG_LICENSE",
  ExternalLink
>;

export type ExternalLinkId = keyof typeof EXTERNAL_LINKS;

/** Get an external link by id — throws in dev if missing */
export function getExternalLink(id: ExternalLinkId): ExternalLink {
  const link = EXTERNAL_LINKS[id];
  if (!link) {
    const msg = `[externalLinks] Unknown external link id: "${id}"`;
    if (import.meta.env.DEV) throw new Error(msg);
    console.error(msg);
  }
  return link;
}

/** All external links as an array (for validation scripts) */
export const ALL_EXTERNAL_LINKS = LINKS;
