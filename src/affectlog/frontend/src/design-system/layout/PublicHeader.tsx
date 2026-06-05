import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, ExternalLink as ExternalLinkIcon, ArrowRight, Server,
} from "lucide-react";
import { cn } from "../cn";
import { PUBLIC_NAV, HEADER_ACTIONS } from "../../navigation/publicNav";
import { EXTERNAL_LINKS } from "../../links/externalLinks";
import type { NavGroup, NavLeaf } from "../../navigation/navTypes";

// ── Mega menu leaf item ─────────────────────────────────────────────────────
function MegaMenuItem({ item, onClose }: { item: NavLeaf; onClose?: () => void }) {
  const isExternal = !!item.externalId;
  const href = isExternal ? EXTERNAL_LINKS[item.externalId!]?.url : undefined;
  const cls =
    "flex items-start gap-3 p-3 rounded-xl transition-all duration-150 hover:bg-white/[0.05] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40";

  const content = (
    <>
      <div>
        <div className="text-sm font-medium text-[#D8E0EE] group-hover:text-[#F8FAFC] transition-colors flex items-center gap-1">
          {item.label}
          {isExternal && <ExternalLinkIcon size={10} className="opacity-40" />}
        </div>
        {item.description && (
          <div className="text-xs text-[#6F7D96] mt-0.5 leading-tight">{item.description}</div>
        )}
      </div>
    </>
  );

  if (isExternal && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClose}>
        {content}
      </a>
    );
  }
  if (item.to) {
    return (
      <Link to={item.to} className={cls} onClick={onClose}>
        {content}
      </Link>
    );
  }
  return null;
}

// ── Desktop mega menu panel ─────────────────────────────────────────────────
function MegaMenu({ group, open }: { group: NavGroup; open: boolean }) {
  const isSingleItem = group.items.length === 1;
  return (
    <AnimatePresence>
      {open && !isSingleItem && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50"
          style={{ width: 340 }}
          role="region"
          aria-label={`${group.label} menu`}
        >
          <div
            className="rounded-2xl border p-2 shadow-card-xl overflow-hidden"
            style={{
              background: "rgba(7,11,26,0.97)",
              backdropFilter: "blur(24px)",
              borderColor: "rgba(203,213,225,0.14)",
            }}
          >
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <MegaMenuItem key={item.label} item={item} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Mobile nav section ──────────────────────────────────────────────────────
function MobileNavSection({ group, onClose }: { group: NavGroup; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const isSingleItem = group.items.length === 1;

  // Single-item groups (Docs, Pricing) are direct links
  if (isSingleItem && group.items[0]?.to) {
    return (
      <Link
        to={group.items[0].to}
        className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-xl hover:bg-white/[0.05] transition-all"
        onClick={onClose}
      >
        {group.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-xl hover:bg-white/[0.05] transition-all"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {group.label}
        <ChevronDown
          size={14}
          className={cn("text-slate-500 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="py-1 pl-4 space-y-0.5">
              {group.items.map((item) => (
                <MegaMenuItem key={item.label} item={item} onClose={onClose} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main header ──────────────────────────────────────────────────────────────
export function PublicHeader() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function openMenu(key: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveMenu(key);
  }

  function scheduleClose() {
    timerRef.current = setTimeout(() => setActiveMenu(null), 120);
  }

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "backdrop-blur-xl border-b" : "bg-transparent"
        )}
        style={
          scrolled
            ? {
                background: "rgba(7,11,26,0.94)",
                borderColor: "rgba(203,213,225,0.10)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.40)",
              }
            : undefined
        }
        role="banner"
      >
        {/* Desktop — 72px */}
        <div className="max-w-[1400px] mx-auto px-6 hidden lg:flex items-center h-[72px] gap-6">
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 rounded-lg"
            aria-label="AffectLog home"
          >
            <img
              src="/img/affectlog360_logo_dark.svg"
              alt="AffectLog"
              className="h-8 object-contain"
              width={120}
              height={32}
            />
          </Link>

          <nav className="flex items-center gap-1 flex-1" aria-label="Main navigation">
            {PUBLIC_NAV.map((group) => {
              const isSingleItem = group.items.length === 1;
              const singleItem = group.items[0];
              return (
                <div
                  key={group.key}
                  className="relative"
                  onMouseEnter={() => !isSingleItem && openMenu(group.key)}
                  onMouseLeave={() => !isSingleItem && scheduleClose()}
                >
                  {isSingleItem && singleItem?.to ? (
                    <Link
                      to={singleItem.to}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all duration-150"
                    >
                      {group.label}
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                        activeMenu === group.key
                          ? "text-white bg-white/[0.07]"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                      )}
                      aria-expanded={activeMenu === group.key}
                      aria-haspopup="true"
                      id={`nav-${group.key}`}
                    >
                      {group.label}
                      <ChevronDown
                        size={12}
                        className={cn(
                          "transition-transform duration-200",
                          activeMenu === group.key && "rotate-180"
                        )}
                      />
                    </button>
                  )}
                  <MegaMenu group={group} open={activeMenu === group.key} />
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-px h-5"
              style={{ background: "rgba(203,213,225,0.15)" }}
              aria-hidden="true"
            />
            <Link
              to={HEADER_ACTIONS.signIn.to}
              className="text-sm font-medium text-[#8391A8] hover:text-[#D8E0EE] transition-colors px-3 py-2 rounded-xl hover:bg-white/[0.04]"
            >
              {HEADER_ACTIONS.signIn.label}
            </Link>
            <Link
              to={HEADER_ACTIONS.selfHost.to}
              className="text-sm font-medium text-[#D8E0EE] hover:text-[#F8FAFC] transition-all px-4 py-2 rounded-xl border hover:bg-white/[0.05]"
              style={{ borderColor: "rgba(203,213,225,0.18)" }}
            >
              {HEADER_ACTIONS.selfHost.label}
            </Link>
            <Link
              to={HEADER_ACTIONS.requestAccess.to}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
              style={{
                background: "linear-gradient(135deg, #93C5FD 0%, #67E8F9 60%, #A7F3D0 100%)",
                boxShadow: "0 4px 16px rgba(147,197,253,0.30)",
                color: "#08111F",
              }}
            >
              {HEADER_ACTIONS.requestAccess.label}
            </Link>
          </div>
        </div>

        {/* Mobile — 64px */}
        <div className="lg:hidden flex items-center h-16 px-5 justify-between gap-4">
          <Link
            to="/"
            className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 rounded"
            aria-label="AffectLog home"
          >
            <img
              src="/img/affectlog360_logo_dark.svg"
              alt="AffectLog"
              className="h-7 object-contain"
            />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={HEADER_ACTIONS.requestAccess.to}
              className="text-xs font-semibold text-white px-3.5 py-2 rounded-xl hidden xs:flex items-center gap-1"
              style={{ background: "linear-gradient(135deg, #93C5FD 0%, #67E8F9 60%, #A7F3D0 100%)", color: "#08111F" }}
            >
              Get Access
            </Link>
            <button
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              id="mobile-menu"
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 lg:hidden flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              aria-label="Mobile navigation"
              style={{ background: "#0B1224" }}
            >
              <div
                className="flex items-center justify-between px-5 h-16 flex-shrink-0 border-b"
                style={{ borderColor: "rgba(203,213,225,0.10)" }}
              >
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  <img src="/img/affectlog360_logo_dark.svg" alt="AffectLog" className="h-7 object-contain" />
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {PUBLIC_NAV.map((group) => (
                  <MobileNavSection key={group.key} group={group} onClose={() => setMenuOpen(false)} />
                ))}
              </div>

              <div
                className="px-4 py-5 flex flex-col gap-3 border-t flex-shrink-0"
                style={{ borderColor: "rgba(203,213,225,0.10)" }}
              >
                <Link
                  to={HEADER_ACTIONS.requestAccess.to}
                  className="flex items-center justify-center gap-2 font-semibold py-3 rounded-xl text-sm transition-all"
                  style={{ background: "linear-gradient(135deg, #93C5FD 0%, #67E8F9 60%, #A7F3D0 100%)", boxShadow: "0 4px 16px rgba(147,197,253,0.30)", color: "#08111F" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Request Managed Access <ArrowRight size={14} />
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={HEADER_ACTIONS.selfHost.to}
                    className="flex items-center justify-center gap-1.5 font-medium text-slate-200 py-2.5 rounded-xl text-sm border"
                    style={{ borderColor: "rgba(203,213,225,0.20)", background: "rgba(255,255,255,0.04)" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Server size={13} /> Self-host
                  </Link>
                  <Link
                    to={HEADER_ACTIONS.signIn.to}
                    className="flex items-center justify-center font-medium text-slate-300 py-2.5 rounded-xl text-sm border"
                    style={{ borderColor: "rgba(203,213,225,0.14)", background: "rgba(255,255,255,0.03)" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <div className="h-16 lg:h-[72px]" aria-hidden="true" />
    </>
  );
}
