export type RouteArea =
  | "public"
  | "auth"
  | "console"
  | "tenant"
  | "admin"
  | "platform"
  | "error";

export type RouteStatus = "active" | "hidden" | "planned" | "deprecated";

export type EditionRequirement = "community" | "managed" | "any";

export interface AppRoute {
  id: string;
  path: string;
  title: string;
  description: string;
  area: RouteArea;
  status: RouteStatus;
  requiresAuth: boolean;
  requiredPermissions?: string[];
  requiredEdition?: EditionRequirement;
  requiredFeatureFlag?: string;
  /** Canonical redirect alias paths that should map here */
  aliases?: string[];
}
