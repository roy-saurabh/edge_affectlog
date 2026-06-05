# Information Architecture

This document describes AffectLog's route, link, navigation, and CTA architecture.

## Route Registry

All routes are declared in `src/affectlog/frontend/src/routing/routes.ts`.

Routes are organized by area:

| Area | Description | Auth Required |
|------|-------------|---------------|
| `public` | Marketing and documentation pages | No |
| `auth` | Login, register, activation | No |
| `console` | Authenticated tenant workspace | Yes |
| `admin` | Tenant administration | Yes + `admin` role |
| `platform` | Multi-tenant platform admin (managed edition) | Yes + `platform_admin` |
| `error` | 404, 403, 500 pages | No |

### Active Public Routes

```
/                     Home
/product              Product overview
/guided-assessment    Guided Assessment
/dataset-audit        Dataset Audit
/model-assessment     Model Assessment
/compliance-exports   Compliance Exports
/community            Community Edition
/cloud                Managed Cloud
/pricing              Editions
/security             Security
/developers           Developers
/docs                 Documentation
/ecosystem            Ecosystem
/openapi              OpenAPI
/self-host            Self-host
/request-access       Request Access
```

### Route Redirects

```
/cloud-managed      → /cloud
/managed            → /cloud
/open-source        → /community
/community-edition  → /community
/api                → /openapi
/assessment         → /guided-assessment
/audit              → /dataset-audit
/contact            → /request-access
```

### Planned Routes (not linked from UI)

Routes with `status: "planned"` are registered but not shown in navigation or CTAs:

- `/app/recipes` — Recipes (feature flag: `recipes`)
- `/app/interoperability` — Interoperability (feature flag: `interoperability`)
- `/app/developers` — Developer Tools (feature flag: planned)
- `/app/settings` — Settings (feature flag: planned)

To activate a planned route: change `status` to `"active"`, implement the page component, add it to `consoleNav.ts`.

## External Link Registry

All external URLs are declared in `src/affectlog/frontend/src/links/externalLinks.ts`.

**No component may hardcode an external URL.** Use `EXTERNAL_LINKS.LINK_ID.url` or the `ExtLink` component.

| ID | URL | Owner |
|----|-----|-------|
| `PROMETHEUS_X_HOME` | https://prometheus-x.org/ | Prometheus-X |
| `PROMETHEUS_X_TRUSTWORTHY_AI` | https://prometheus-x.org/bb04-trustworthy-ai-assessment/ | Prometheus-X |
| `PROMETHEUS_X_TAI_DOCS` | https://prometheus-x-association.github.io/docs/t-ai/ | Prometheus-X |
| `EDGE_SKILLS_EC_PROJECT` | EC portal link | European Commission |
| `AFFECTLOG_REPO` | https://github.com/Prometheus-X-association/t-ai-affectlog | GitHub |
| `AFFECTLOG_ISSUES` | ...t-ai-affectlog/issues | GitHub |
| `AFFECTLOG_SECURITY` | ...t-ai-affectlog/security | GitHub |
| `AFFECTLOG_CONTRIBUTING` | ...t-ai-affectlog/blob/main/CONTRIBUTING.md | GitHub |
| `AFFECTLOG_LICENSE` | ...t-ai-affectlog/blob/main/LICENSE | GitHub |

## CTA Registry

All CTAs are declared in `src/affectlog/frontend/src/cta/ctaRegistry.ts`.

Each CTA has:
- `id` — unique identifier
- `label` — button text (no generic labels like "Learn more")
- `purpose` — why this CTA exists
- `targetType` — `route | external | api-action | modal | download | anchor`
- `targetId` — route id, external link id, or action name
- `variant` — visual style
- `area` — `marketing | console | admin | wizard | docs | auth`

## Navigation Registries

| File | Purpose |
|------|---------|
| `navigation/publicNav.ts` | Public header (6 top-level groups max) |
| `navigation/consoleNav.ts` | Console sidebar (role/edition-aware groups) |
| `navigation/footerNav.ts` | Footer columns |

## How to Add a New Page

1. Create the page component in `src/pages/public/` or appropriate subdirectory
2. Add a route entry in `src/routing/routes.ts` with `status: "active"`
3. Add lazy import and `<Route>` in `src/App.tsx`
4. Add to appropriate navigation registry (`publicNav.ts` or `consoleNav.ts`)
5. Add CTAs to `src/cta/ctaRegistry.ts`
6. Run `npm run validate:ia` to verify
7. Update `public/sitemap.xml` if public

## How to Add a New External Link

1. Add entry to `src/links/externalLinks.ts`
2. Add the ID to the type union
3. Reference by ID everywhere — never copy the raw URL

## Role and Edition Visibility

Console sidebar groups respect:
- `requiredPermissions: ["admin"]` — only shown to admin users
- `requiredPermissions: ["platform_admin"]` — only shown to platform admins
- `managedOnly: true` — only shown in managed edition
- `requiredFeatureFlag: "flag_name"` — only shown when feature flag is on

Public pages show auth-aware CTAs based on `useAuth()` hook state.

## CI Validation

The following validators run on every PR and push to main:

| Script | What it checks |
|--------|---------------|
| `validate:routes` | Route IDs unique, paths valid, no placeholders |
| `validate:links` | No raw external URLs outside externalLinks.ts |
| `validate:ctas` | CTA targets resolve, no generic labels |
| `validate:nav` | Nav paths exist in route registry |
| `validate:docs` | Docs links map to real files |
| `validate:sitemap` | Sitemap contains only active public routes |

Run all at once: `npm run validate:ia`
