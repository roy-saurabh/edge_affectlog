import type { ExternalLinkId } from "../links/externalLinks";

export interface NavLeaf {
  type: "leaf";
  label: string;
  description?: string;
  /** internal route path */
  to?: string;
  /** external link id from externalLinks registry */
  externalId?: ExternalLinkId;
  icon?: string;
}

export interface NavGroup {
  type: "group";
  label: string;
  key: string;
  items: NavLeaf[];
}

export type NavItem = NavLeaf | NavGroup;

export interface SidebarNavItem {
  to: string;
  label: string;
  iconName: string;
  end?: boolean;
  badge?: string | number;
  /** Required permissions to show this item */
  requiredPermissions?: string[];
  /** Only show in managed edition */
  managedOnly?: boolean;
  /** Only show when feature flag is enabled */
  requiredFeatureFlag?: string;
}

export interface SidebarNavGroup {
  groupLabel: string;
  items: SidebarNavItem[];
  requiredPermissions?: string[];
  managedOnly?: boolean;
}
