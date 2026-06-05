import React from "react";
import { NavLink } from "react-router-dom";
import {
  X, LogOut,
  LayoutDashboard, Database, FlaskConical, ShieldCheck, Cpu, Wand2,
  Settings, ClipboardList, Users, Shield, Mail, Activity,
  BookMarked, Network, Globe, Building2, ToggleLeft, BarChart3,
  Headphones, ScrollText,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../cn";
import { useAuth } from "../../auth/AuthProvider";
import { CONSOLE_NAV_GROUPS } from "../../navigation/consoleNav";
import type { SidebarNavGroup, SidebarNavItem } from "../../navigation/navTypes";

// ── Icon map (icon names from consoleNav.ts → lucide components) ─────────
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard, Database, FlaskConical, ShieldCheck, Cpu, Wand2,
  Settings, ClipboardList, Users, Shield, Mail, Activity,
  BookMarked, Network, Globe, Building2, ToggleLeft, BarChart3,
  Headphones, ScrollText,
};

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  badge?: string | number;
}

interface ConsoleSidebarProps {
  nav?: NavItem[];
  open: boolean;
  onClose: () => void;
  variant?: "app" | "admin";
}

// ── Sidebar nav link ─────────────────────────────────────────────────────
function SidebarLink({
  item,
  accentBg,
  accentColor,
  accentBorder,
  onClose,
}: {
  item: SidebarNavItem;
  accentBg: string;
  accentColor: string;
  accentBorder: string;
  onClose: () => void;
}) {
  const Icon = ICON_MAP[item.iconName] ?? Settings;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
          isActive
            ? "text-white"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
        )
      }
      style={({ isActive }) =>
        isActive
          ? { background: accentBg, color: accentColor, border: `1px solid ${accentBorder}` }
          : undefined
      }
      onClick={onClose}
    >
      <Icon size={15} className="flex-shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className="text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
          style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5" }}
        >
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}

// ── Role / edition check ─────────────────────────────────────────────────
function useIsAdmin() {
  const { user } = useAuth();
  return !!(
    user?.is_superadmin ||
    user?.roles?.some((r) => ["Super Admin", "Admin"].includes(r))
  );
}

function groupVisible(group: SidebarNavGroup, isAdmin: boolean, _isManagedEdition: boolean): boolean {
  if (group.requiredPermissions?.includes("admin") && !isAdmin) return false;
  if (group.requiredPermissions?.includes("platform_admin")) return false; // platform admin not in community
  if (group.managedOnly && !_isManagedEdition) return false;
  return true;
}

// ── Main sidebar ─────────────────────────────────────────────────────────
export function ConsoleSidebar({ open, onClose, variant = "app" }: ConsoleSidebarProps) {
  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin();
  const isManagedEdition = false; // community edition; set via feature flag when managed

  const accentColor  = variant === "admin" ? "#C4B5FD" : "#67E8F9";
  const accentBg     = variant === "admin" ? "rgba(196,181,253,0.09)" : "rgba(103,232,249,0.09)";
  const accentBorder = variant === "admin" ? "rgba(196,181,253,0.22)" : "rgba(103,232,249,0.22)";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[220px] z-30 flex flex-col",
          "border-r transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
        style={{ background: "#0B1224", borderColor: "rgba(203,213,225,0.10)" }}
        aria-label="Console navigation"
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 h-14 flex-shrink-0 border-b"
          style={{ borderColor: "rgba(203,213,225,0.08)" }}
        >
          <NavLink
            to="/"
            className="flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 rounded"
            aria-label="AffectLog home"
          >
            <img
              src="/img/affectlog360_logo_dark.svg"
              alt="AffectLog"
              className="h-6 object-contain object-left"
            />
          </NavLink>
          {variant === "admin" && (
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ background: accentBg, color: accentColor, border: `1px solid ${accentBorder}` }}
            >
              Admin
            </span>
          )}
          <button
            className="flex-shrink-0 lg:hidden text-slate-500 hover:text-slate-300 p-1"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4" aria-label="Console links">
          {CONSOLE_NAV_GROUPS.filter((g) => groupVisible(g, isAdmin, isManagedEdition)).map((group) => {
            const visibleItems = group.items.filter((item) => {
              if (item.managedOnly && !isManagedEdition) return false;
              if (item.requiredFeatureFlag) return false; // feature flags not enabled by default
              if (group.requiredPermissions?.includes("admin") && !isAdmin) return false;
              return true;
            });
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.groupLabel}>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1">
                  {group.groupLabel}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => (
                    <SidebarLink
                      key={item.to}
                      item={item}
                      accentBg={accentBg}
                      accentColor={accentColor}
                      accentBorder={accentBorder}
                      onClose={onClose}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-2 py-3 border-t flex-shrink-0 space-y-0.5"
          style={{ borderColor: "rgba(203,213,225,0.08)" }}
        >
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-all duration-150"
          >
            <LogOut size={15} />
            Sign out
          </button>

          {user && (
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(203,213,225,0.09)" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: accentBg, color: accentColor }}
              >
                {(user.full_name ?? user.email ?? "?")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-300 truncate">{user.full_name ?? user.email}</p>
                <p className="text-xs text-slate-600 truncate">{user.roles?.[0] ?? "Member"}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
