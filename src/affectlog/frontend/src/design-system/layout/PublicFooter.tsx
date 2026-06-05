import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink as ExternalLinkIcon, ChevronDown, ArrowRight, Server } from "lucide-react";
import { cn } from "../cn";
import { FOOTER_NAV } from "../../navigation/footerNav";
import { EXTERNAL_LINKS } from "../../links/externalLinks";

// ── Footer link component ─────────────────────────────────────────────────
function FooterLink({ link }: { link: { label: string; to?: string; externalId?: string } }) {
  const cls =
    "text-sm text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:underline";

  if (link.to) {
    return <Link to={link.to} className={cls}>{link.label}</Link>;
  }

  if (link.externalId) {
    const ext = EXTERNAL_LINKS[link.externalId as keyof typeof EXTERNAL_LINKS];
    if (!ext) return null;
    return (
      <a
        href={ext.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        aria-label={`${ext.label} (opens in new tab)`}
      >
        {link.label}
        <ExternalLinkIcon size={10} className="opacity-30 flex-shrink-0" />
      </a>
    );
  }

  return null;
}

// ── Mobile accordion column ───────────────────────────────────────────────
function FooterAccordion({ col }: { col: (typeof FOOTER_NAV)[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "rgba(203,213,225,0.10)" }}>
      <button
        className="flex items-center justify-between w-full py-3.5 text-left text-sm font-semibold text-slate-400 uppercase tracking-widest"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {col.title}
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "400px" : "0", opacity: open ? 1 : 0 }}
      >
        <ul className="pb-4 space-y-2.5">
          {col.links.map((link) => (
            <li key={link.label}>
              <FooterLink link={link} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Main footer ───────────────────────────────────────────────────────────
export function PublicFooter() {
  const edgeSkillsUrl  = EXTERNAL_LINKS.EDGE_SKILLS_EC_PROJECT.url;
  const prometheusUrl  = EXTERNAL_LINKS.PROMETHEUS_X_TAI_DOCS.url;
  const licenseUrl     = EXTERNAL_LINKS.AFFECTLOG_LICENSE.url;

  return (
    <footer
      style={{ background: "#070B1A", borderTop: "1px solid rgba(203,213,225,0.09)" }}
      aria-label="Site footer"
    >
      {/* ── CTA Band ─────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "#0B1224", borderBottom: "1px solid rgba(203,213,225,0.09)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-40 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(103,232,249,0.07) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-6 py-14 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
            Start a privacy-preserving AI assessment workflow
          </h2>
          <p className="text-slate-400 mb-8 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Self-host the open-source core or request an AffectLog-managed environment for
            hosted operations, onboarding, monitoring, and support.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/request-access"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
              style={{
                background: "linear-gradient(135deg, #93C5FD 0%, #67E8F9 60%, #A7F3D0 100%)",
                boxShadow: "0 4px 14px rgba(103,232,249,0.25)",
                color: "#08111F",
              }}
            >
              Request Managed Access <ArrowRight size={15} />
            </Link>
            <Link
              to="/self-host"
              className="inline-flex items-center gap-2 font-semibold text-slate-200 px-6 py-3 rounded-xl border transition-all duration-200 hover:bg-white/[0.06] hover:border-slate-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
              style={{ borderColor: "rgba(203,213,225,0.22)", background: "rgba(255,255,255,0.04)" }}
            >
              <Server size={15} /> Deploy Community Edition
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white px-5 py-3 text-sm rounded-xl hover:bg-white/[0.04] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
            >
              View Documentation <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main body ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Brand + EU funding row */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-10">
          <div className="flex-shrink-0 max-w-xs">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group" aria-label="AffectLog">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #93C5FD 0%, #67E8F9 60%, #A7F3D0 100%)" }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="3" fill="white" opacity="0.9" />
                  <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.2" strokeOpacity="0.4" />
                </svg>
              </div>
              <span className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">AffectLog</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Open-source and managed Trustworthy AI assessment for education and skills data spaces.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href={EXTERNAL_LINKS.AFFECTLOG_REPO.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="AffectLog on GitHub (opens in new tab)"
              >
                GitHub
              </a>
              <Link
                to="/openapi"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                API Reference
              </Link>
            </div>
          </div>

          <div className="md:ml-auto max-w-sm">
            <p className="text-xs text-slate-600 leading-relaxed">
              This project has received funding from the Digital Europe Programme under the EDGE-Skills
              project (grant agreement 101123471). Views expressed are those of the authors and do not
              necessarily reflect those of the European Commission.
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <a
                href={edgeSkillsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
                aria-label="EDGE-Skills EU Project (opens in new tab)"
              >
                EDGE-Skills <ExternalLinkIcon size={9} />
              </a>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <a
                href={prometheusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
                aria-label="Prometheus-X BB04 Technical Docs (opens in new tab)"
              >
                Prometheus-X BB04 <ExternalLinkIcon size={9} />
              </a>
            </div>
          </div>
        </div>

        <div className="accent-line-trust mb-10" role="separator" />

        {/* Link columns — desktop */}
        <nav className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-8 mb-12" aria-label="Footer links">
          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Link columns — mobile accordion */}
        <nav className="md:hidden mb-8" aria-label="Footer links mobile">
          {FOOTER_NAV.map((col) => (
            <FooterAccordion key={col.title} col={col} />
          ))}
        </nav>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600"
          style={{ borderTop: "1px solid rgba(203,213,225,0.07)" }}
        >
          <p>
            AffectLog Community Edition is released under the{" "}
            <a
              href={licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-400 underline underline-offset-2"
              aria-label="MIT License (opens in new tab)"
            >
              MIT License
            </a>
            .{" "}
            Managed Edition services may include proprietary operational components.
          </p>
          <p className="flex-shrink-0 text-slate-700">
            Raw datasets never committed · Synthetic samples provided
          </p>
        </div>
      </div>
    </footer>
  );
}
