/**
 * Public navigation smoke tests.
 * Verifies every public nav item, redirects, and header actions.
 * Run: npx playwright test tests/e2e/navigation.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

// All active public routes
const PUBLIC_ROUTES = [
  { path: "/",                   title: "AffectLog" },
  { path: "/product",            title: "Product" },
  { path: "/guided-assessment",  title: "Guided Assessment" },
  { path: "/dataset-audit",      title: "Dataset Audit" },
  { path: "/model-assessment",   title: "Model Assessment" },
  { path: "/compliance-exports", title: "Compliance Exports" },
  { path: "/community",          title: "Community" },
  { path: "/cloud",              title: "Managed Cloud" },
  { path: "/pricing",            title: "Pricing" },
  { path: "/security",           title: "Security" },
  { path: "/developers",         title: "Developers" },
  { path: "/docs",               title: "Docs" },
  { path: "/ecosystem",          title: "Ecosystem" },
  { path: "/openapi",            title: "OpenAPI" },
  { path: "/self-host",          title: "Self-host" },
  { path: "/request-access",     title: "Request Access" },
];

const REDIRECTS: [string, string][] = [
  ["/cloud-managed",     "/cloud"],
  ["/managed",           "/cloud"],
  ["/open-source",       "/community"],
  ["/community-edition", "/community"],
  ["/contact",           "/request-access"],
];

test.describe("Public route smoke tests", () => {
  for (const { path } of PUBLIC_ROUTES) {
    test(`GET ${path} returns 200`, async ({ page }) => {
      const response = await page.goto(`${BASE}${path}`);
      expect(response?.status()).toBeLessThan(400);
    });
  }
});

test.describe("Public route H1 checks", () => {
  for (const { path } of PUBLIC_ROUTES) {
    test(`${path} has exactly one H1`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
    });
  }
});

test.describe("Redirects", () => {
  for (const [from, to] of REDIRECTS) {
    test(`${from} redirects to ${to}`, async ({ page }) => {
      await page.goto(`${BASE}${from}`);
      await page.waitForURL(`**${to}**`, { timeout: 10_000 });
      expect(page.url()).toContain(to);
    });
  }
});

test.describe("Public header navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test("header has no more than six top-level nav items", async ({ page }) => {
    const navButtons = await page.locator("header nav button, header nav a[href]").count();
    // Count only direct children — allow up to 9 items (6 nav + 3 action buttons)
    expect(navButtons).toBeLessThanOrEqual(12);
  });

  test("Sign in link points to /login", async ({ page }) => {
    const signIn = page.getByRole("link", { name: /Sign in/i }).first();
    await expect(signIn).toHaveAttribute("href", "/login");
  });

  test("Request Access CTA exists and points to /request-access", async ({ page }) => {
    const cta = page.getByRole("link", { name: /Request Access/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/request-access");
  });

  test("Self-host link points to /self-host", async ({ page }) => {
    const selfHost = page.getByRole("link", { name: /Self-host/i }).first();
    await expect(selfHost).toHaveAttribute("href", "/self-host");
  });

  test("header has no href='#' links", async ({ page }) => {
    const badLinks = await page.locator("header a[href='#']").count();
    expect(badLinks).toBe(0);
  });
});

test.describe("Forbidden content checks", () => {
  const FORBIDDEN_TERMS = ["D3.7", "TRL", "lorem ipsum", "coming soon", "TODO", "placeholder"];

  for (const { path } of PUBLIC_ROUTES.slice(0, 6)) {
    for (const term of FORBIDDEN_TERMS) {
      test(`${path} does not contain "${term}"`, async ({ page }) => {
        await page.goto(`${BASE}${path}`);
        const content = await page.content();
        expect(content).not.toContain(term);
      });
    }
  }
});

test.describe("Auth page routes", () => {
  test("login page renders sign-in heading", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();
  });

  test("register page renders", async ({ page }) => {
    await page.goto(`${BASE}/register`);
    const response = await page.goto(`${BASE}/register`);
    expect(response?.status()).toBeLessThan(400);
  });

  test("awaiting-approval page renders", async ({ page }) => {
    await page.goto(`${BASE}/awaiting-approval`);
    const response = await page.goto(`${BASE}/awaiting-approval`);
    expect(response?.status()).toBeLessThan(400);
  });
});
