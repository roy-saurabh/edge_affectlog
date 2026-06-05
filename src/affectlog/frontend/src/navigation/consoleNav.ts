import type { SidebarNavGroup } from "./navTypes";

// ── Console (app) navigation groups ────────────────────────────────────────
// Visibility is controlled by requiredPermissions and managedOnly flags.
// The ConsoleSidebar component reads these and hides groups/items as needed.

export const CONSOLE_NAV_GROUPS: SidebarNavGroup[] = [
  {
    groupLabel: "Workspace",
    items: [
      { to: "/app/wizard",   label: "Guided Assessment", iconName: "Wand2",          end: false },
      { to: "/app",          label: "Dashboard",         iconName: "LayoutDashboard", end: true  },
      { to: "/app/datasets", label: "Datasets",          iconName: "Database" },
      { to: "/app/audit",    label: "Audit Runs",        iconName: "FlaskConical" },
      { to: "/app/models",   label: "Models",            iconName: "Cpu" },
      { to: "/app/compliance",label: "Compliance",       iconName: "ShieldCheck" },
    ],
  },
  {
    groupLabel: "Tools",
    items: [
      { to: "/app/recipes",          label: "Recipes",          iconName: "BookMarked",  requiredFeatureFlag: "recipes" },
      { to: "/app/interoperability", label: "Interoperability", iconName: "Network",     requiredFeatureFlag: "interoperability" },
    ],
  },
  {
    groupLabel: "Tenant Admin",
    requiredPermissions: ["admin"],
    items: [
      { to: "/admin",                       label: "Admin Overview",  iconName: "Settings",     end: true },
      { to: "/admin/pending-registrations", label: "Registrations",   iconName: "ClipboardList" },
      { to: "/admin/users",                 label: "Users",           iconName: "Users" },
      { to: "/admin/audit-log",             label: "Audit Log",       iconName: "Shield" },
      { to: "/admin/email",                 label: "Email",           iconName: "Mail" },
      { to: "/admin/system",                label: "System Health",   iconName: "Activity" },
    ],
  },
  {
    groupLabel: "Platform",
    requiredPermissions: ["platform_admin"],
    managedOnly: true,
    items: [
      { to: "/platform",              label: "Platform Overview", iconName: "Globe",      end: true, managedOnly: true },
      { to: "/platform/tenants",      label: "Tenants",           iconName: "Building2",  managedOnly: true },
      { to: "/platform/feature-flags",label: "Feature Flags",     iconName: "ToggleLeft", managedOnly: true },
      { to: "/platform/usage",        label: "Usage",             iconName: "BarChart3",  managedOnly: true },
      { to: "/platform/system-health",label: "System Health",     iconName: "Activity",   managedOnly: true },
      { to: "/platform/support-access",label: "Support Access",   iconName: "Headphones", managedOnly: true },
      { to: "/platform/audit-log",    label: "Audit Log",         iconName: "ScrollText", managedOnly: true },
    ],
  },
];
