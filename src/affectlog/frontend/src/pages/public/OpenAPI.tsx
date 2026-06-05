import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, ArrowRight, ExternalLink, Terminal, Lock, Activity, Database, Cpu, FileText, Share2, Download } from "lucide-react";
import { PublicHeader } from "../../components/public/PublicHeader";
import { PublicFooter } from "../../components/public/PublicFooter";
import { GridBackground, GlowOrb } from "../../design-system/primitives/GridBackground";
import { CodeBlock } from "../../design-system/primitives/CodeBlock";
import { EXTERNAL_LINKS } from "../../links/externalLinks";

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

const API_CATEGORIES = [
  { icon: Terminal,  label: "Wizard APIs",          desc: "Plan assessment, validate schema, check scope, generate output contract.",      color: "#67E8F9" },
  { icon: Database,  label: "Dataset APIs",          desc: "Upload, validate, run profile, compute metrics, get field inventory.",          color: "#93C5FD" },
  { icon: Cpu,       label: "Model APIs",            desc: "Register adapter, run explanation, generate model card, compare models.",       color: "#C4B5FD" },
  { icon: FileText,  label: "Compliance APIs",       desc: "Generate SOPs, data cards, JSON-LD graphs, audit manifests, and reports.",     color: "#86EFAC" },
  { icon: Share2,    label: "Interoperability APIs", desc: "Export metadata for Prometheus-X PDC connector and BB04 interoperability.",     color: "#A7F3D0" },
  { icon: Lock,      label: "Admin APIs",            desc: "User management, RBAC, pending registrations, system health, audit log.",      color: "#FCD34D" },
];

// API Docs link — served by FastAPI at /api/docs (proxied by Vite in dev)
const API_DOCS_PATH = "/api/docs";
// OpenAPI JSON — served at /openapi.json (proxied by Vite in dev)
const OPENAPI_JSON_PATH = "/openapi.json";

function Hero() {
  return (
    <section
      className="relative min-h-[76vh] flex items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #070B1A 0%, #0B1224 100%)" }}
    >
      <GridBackground />
      <GlowOrb color="cyan" size={600} x="80%" y="25%" opacity={0.4} />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <FadeUp delay={0.04}>
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8"
                style={{ color: "#67E8F9", background: "rgba(103,232,249,0.08)", border: "1px solid rgba(103,232,249,0.22)" }}
              >
                <Code2 size={11} />
                OpenAPI-first
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1
                className="font-bold text-white mb-5 leading-tight tracking-tight"
                style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)", letterSpacing: "-0.03em" }}
              >
                OpenAPI-first assessment workflows
              </h1>
            </FadeUp>
            <FadeUp delay={0.17}>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-[520px]">
                Automate dataset validation, wizard planning, audit execution, model explanations,
                compliance exports, and interoperability metadata through documented REST APIs.
              </p>
            </FadeUp>
            <FadeUp delay={0.23}>
              <div className="flex flex-wrap gap-3">
                <a
                  href={API_DOCS_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-6 py-3.5 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
                  style={{ background: "linear-gradient(135deg, #93C5FD 0%, #67E8F9 60%, #A7F3D0 100%)", boxShadow: "0 6px 20px rgba(103,232,249,0.28)", color: "#08111F" }}
                  aria-label="Interactive API Docs — opens Swagger UI in new tab (requires backend running)"
                >
                  Interactive API Docs <ExternalLink size={15} />
                </a>
                <a
                  href={OPENAPI_JSON_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-slate-200 rounded-xl px-6 py-3.5 border transition-all hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
                  style={{ borderColor: "rgba(203,213,225,0.22)", background: "rgba(255,255,255,0.04)" }}
                  aria-label="Download openapi.json — downloads the OpenAPI 3.1 spec (requires backend running)"
                >
                  <Download size={14} /> Download openapi.json
                </a>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.25}>
            <CodeBlock
              label="Quick API call"
              lines={[
                { text: "# Run dataset validation", color: "#475569" },
                { text: "curl -X POST /api/v1/datasets/validate \\", color: "#67E8F9" },
                { text: '  -H "Authorization: Bearer $TOKEN" \\', color: "#94a3b8" },
                { text: '  -F "file=@dataset.csv" \\', color: "#86EFAC" },
                { text: '  -F "recipe=generic_csv"', color: "#86EFAC" },
                { text: "", color: "#475569" },
                { text: "# Response", color: "#475569" },
                { text: '{"status": "valid", "fields": 24, "rows": 98432,', color: "#C4B5FD" },
                { text: ' "pii_flags": 2, "recipe_match": true}', color: "#C4B5FD" },
              ]}
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function APICategories() {
  return (
    <section className="py-24 md:py-28" style={{ background: "#070B1A" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <FadeUp>
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Six API categories</h2>
            <p className="text-lg text-slate-400">All workflows are accessible via versioned, documented REST endpoints.</p>
          </div>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {API_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <FadeUp key={cat.label} delay={i * 0.05}>
                <div
                  className="rounded-2xl p-6 border h-full transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(203,213,225,0.10)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${cat.color}14` }}>
                      <Icon size={15} style={{ color: cat.color }} aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-white text-sm">{cat.label}</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{cat.desc}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AuthSection() {
  return (
    <section className="py-24 md:py-28" style={{ background: "#0B1224" }}>
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <FadeUp>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Authentication</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                All API endpoints require a Bearer token. Obtain a token via the{" "}
                <code className="text-[#67E8F9] bg-cyan-950/30 px-1.5 py-0.5 rounded text-sm font-mono">/api/auth/login</code>{" "}
                endpoint with your admin-approved credentials.
              </p>
              <div className="space-y-3">
                {[
                  { label: "POST /api/auth/login",   desc: "Obtain access token" },
                  { label: "POST /api/auth/refresh",  desc: "Refresh token" },
                  { label: "GET  /api/auth/me",        desc: "Current user profile" },
                ].map((ep) => (
                  <div key={ep.label} className="flex items-center gap-3 text-sm">
                    <code className="font-mono text-xs text-[#67E8F9] bg-cyan-950/20 px-2 py-1 rounded border border-cyan-800/20 flex-shrink-0">
                      {ep.label}
                    </code>
                    <span className="text-slate-500">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Access the API</h2>
              <p className="text-slate-400 mb-4 text-sm">
                With the backend running, the interactive docs and raw spec are available at:
              </p>
              <div
                className="rounded-xl p-4 border font-mono text-sm mb-3"
                style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <a
                  href={API_DOCS_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#67E8F9] hover:underline inline-flex items-center gap-1"
                  aria-label="Swagger UI at /api/docs (opens in new tab)"
                >
                  {API_DOCS_PATH} <ExternalLink size={11} />
                </a>
                <p className="text-slate-500 text-xs mt-2">Swagger UI — live try-it panel</p>
              </div>
              <div
                className="rounded-xl p-4 border font-mono text-sm"
                style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <a
                  href={OPENAPI_JSON_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#67E8F9] hover:underline inline-flex items-center gap-1"
                  aria-label="OpenAPI JSON at /openapi.json (opens in new tab)"
                >
                  {OPENAPI_JSON_PATH} <ExternalLink size={11} />
                </a>
                <p className="text-slate-500 text-xs mt-2">OpenAPI 3.1 JSON schema</p>
              </div>
              <p className="text-slate-600 text-xs mt-3 leading-relaxed">
                In development, the Vite proxy forwards these paths to the backend on port 8000.
                Deploy with the backend and frontend on the same origin in production.
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20 md:py-24" style={{ background: "#070B1A" }}>
      <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
        <FadeUp>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Automate your assessment workflows
          </h2>
          <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
            All platform capabilities are available via documented, versioned OpenAPI endpoints.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={API_DOCS_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
              style={{ background: "linear-gradient(135deg, #93C5FD 0%, #67E8F9 60%, #A7F3D0 100%)", boxShadow: "0 4px 14px rgba(103,232,249,0.25)", color: "#08111F" }}
              aria-label="Interactive API Docs (opens in new tab)"
            >
              Interactive API Docs <ExternalLink size={14} />
            </a>
            <a
              href={EXTERNAL_LINKS.AFFECTLOG_CONTRIBUTING.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-slate-200 px-6 py-3 rounded-xl border transition-all hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
              style={{ borderColor: "rgba(203,213,225,0.22)", background: "rgba(255,255,255,0.04)" }}
              aria-label="Contribute API Client on GitHub (opens in new tab)"
            >
              Contribute API Client <ExternalLink size={14} />
            </a>
            <Link
              to="/self-host"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white px-5 py-3 text-sm rounded-xl hover:bg-white/[0.04] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
            >
              Self-host guide <ArrowRight size={13} />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export default function OpenAPIPage() {
  return (
    <div style={{ background: "#070B1A", color: "#F8FAFC", minHeight: "100vh" }}>
      <PublicHeader />
      <main id="main-content">
        <Hero />
        <APICategories />
        <AuthSection />
        <FinalCTA />
      </main>
      <PublicFooter />
    </div>
  );
}
