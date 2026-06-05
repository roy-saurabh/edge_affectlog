import type { ExternalLinkId } from "../links/externalLinks";

interface FooterLink {
  label: string;
  to?: string;
  externalId?: ExternalLinkId;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const FOOTER_NAV: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Product Overview",    to: "/product" },
      { label: "Guided Assessment",   to: "/guided-assessment" },
      { label: "Dataset Audit",       to: "/dataset-audit" },
      { label: "Model Assessment",    to: "/model-assessment" },
      { label: "Compliance Exports",  to: "/compliance-exports" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Community Edition", to: "/community" },
      { label: "Managed Cloud",     to: "/cloud" },
      { label: "Editions",          to: "/pricing" },
      { label: "Security",          to: "/security" },
      { label: "Self-host",         to: "/self-host" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Developers",        to: "/developers" },
      { label: "OpenAPI",           to: "/openapi" },
      { label: "GitHub",            externalId: "AFFECTLOG_REPO" },
      { label: "Contributing",      externalId: "AFFECTLOG_CONTRIBUTING" },
      { label: "Issues",            externalId: "AFFECTLOG_ISSUES" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "Prometheus-X",                    externalId: "PROMETHEUS_X_HOME" },
      { label: "Trustworthy AI Assessment",       externalId: "PROMETHEUS_X_TRUSTWORTHY_AI" },
      { label: "Technical Docs",                  externalId: "PROMETHEUS_X_TAI_DOCS" },
      { label: "EDGE-Skills",                     externalId: "EDGE_SKILLS_EC_PROJECT" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "License (MIT)",    externalId: "AFFECTLOG_LICENSE" },
      { label: "Security Policy",  externalId: "AFFECTLOG_SECURITY" },
      { label: "Governance",       to: "/docs" },
      // Code of Conduct and CITATION links omitted until those files exist in the repo
    ],
  },
];
