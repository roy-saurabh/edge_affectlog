export type CTATargetType = "route" | "external" | "api-action" | "modal" | "download" | "mailto" | "anchor";
export type CTAVariant = "primary" | "secondary" | "tertiary" | "danger" | "success" | "outline" | "ghost";
export type CTAArea = "marketing" | "console" | "admin" | "wizard" | "docs" | "auth";
export type EditionRequirement = "community" | "managed" | "any";

export interface CTA {
  id: string;
  label: string;
  purpose: string;
  targetType: CTATargetType;
  /** route id, external link id, anchor hash, or action name */
  targetId: string;
  variant: CTAVariant;
  area: CTAArea;
  requiredAuth?: boolean;
  requiredPermissions?: string[];
  requiredEdition?: EditionRequirement;
  requiredFeatureFlag?: string;
  trackingEvent?: string;
  /** aria-label override if label alone isn't descriptive enough */
  ariaLabel?: string;
}
