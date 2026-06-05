export type LinkOwner =
  | "Prometheus-X"
  | "EDGE-Skills"
  | "European Commission"
  | "GitHub"
  | "AffectLog"
  | "Docs";

export interface ExternalLink {
  id: string;
  label: string;
  url: string;
  owner: LinkOwner;
  purpose: string;
  expectedStatus?: 200 | 301 | 302;
  publicSafe: boolean;
}
