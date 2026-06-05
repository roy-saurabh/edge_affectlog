import type { NavGroup } from "./navTypes";

// Public header navigation — max 6 top-level items.
// Each group uses route paths (internal) or external link IDs.
export const PUBLIC_NAV: NavGroup[] = [
  {
    type: "group",
    label: "Product",
    key: "product",
    items: [
      { type: "leaf", label: "Product Overview",     to: "/product",             description: "Platform capabilities at a glance" },
      { type: "leaf", label: "Guided Assessment",    to: "/guided-assessment",   description: "Step-by-step wizard with guardrails" },
      { type: "leaf", label: "Dataset Audit",        to: "/dataset-audit",       description: "Profiling, PII scan, xAPI metrics" },
      { type: "leaf", label: "Model Assessment",     to: "/model-assessment",    description: "Adapters, explanations, model cards" },
      { type: "leaf", label: "Compliance Exports",   to: "/compliance-exports",  description: "SOPs, data cards, JSON-LD graphs" },
    ],
  },
  {
    type: "group",
    label: "Platform",
    key: "platform",
    items: [
      { type: "leaf", label: "Community Edition", to: "/community",  description: "Self-hosted open-source core" },
      { type: "leaf", label: "Managed Cloud",     to: "/cloud",      description: "AffectLog-operated infrastructure" },
      { type: "leaf", label: "Security",          to: "/security",   description: "RBAC, pseudonymisation, audit logs" },
      { type: "leaf", label: "Self-host",         to: "/self-host",  description: "Docker Compose deployment guide" },
      { type: "leaf", label: "OpenAPI",           to: "/openapi",    description: "OpenAPI-first automation workflows" },
    ],
  },
  {
    type: "group",
    label: "Developers",
    key: "developers",
    items: [
      { type: "leaf", label: "Developers",        to: "/developers",                 description: "Developer resources and recipes" },
      { type: "leaf", label: "GitHub",            externalId: "AFFECTLOG_REPO",      description: "Source code and issues" },
      { type: "leaf", label: "Contributor Guide", externalId: "AFFECTLOG_CONTRIBUTING", description: "How to add recipes and adapters" },
      { type: "leaf", label: "Issues",            externalId: "AFFECTLOG_ISSUES",    description: "Bug reports and feature requests" },
      { type: "leaf", label: "Security Policy",   externalId: "AFFECTLOG_SECURITY",  description: "Responsible disclosure" },
    ],
  },
  {
    type: "group",
    label: "Ecosystem",
    key: "ecosystem",
    items: [
      { type: "leaf", label: "Ecosystem",                       to: "/ecosystem",                          description: "Prometheus-X and EDGE-Skills context" },
      { type: "leaf", label: "Prometheus-X Trustworthy AI",     externalId: "PROMETHEUS_X_TRUSTWORTHY_AI", description: "BB04 building block overview" },
      { type: "leaf", label: "Technical BB04 Docs",             externalId: "PROMETHEUS_X_TAI_DOCS",       description: "Technical documentation for t-ai" },
      { type: "leaf", label: "EDGE-Skills Project",             externalId: "EDGE_SKILLS_EC_PROJECT",      description: "EU Digital Europe programme" },
    ],
  },
  {
    type: "group",
    label: "Docs",
    key: "docs",
    items: [
      { type: "leaf", label: "Documentation", to: "/docs", description: "Guides, APIs, architecture" },
    ],
  },
  {
    type: "group",
    label: "Pricing",
    key: "pricing",
    items: [
      { type: "leaf", label: "Editions", to: "/pricing", description: "Compare Community and Managed Cloud" },
    ],
  },
];

/** Header right-side action links (not nav menus) */
export const HEADER_ACTIONS = {
  signIn: { label: "Sign in",        to: "/login" },
  selfHost: { label: "Self-host",    to: "/self-host" },
  requestAccess: { label: "Request Access", to: "/request-access" },
} as const;
