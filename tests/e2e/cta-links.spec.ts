/**
 * Page CTA validation tests.
 * Verifies primary and final CTAs on each public page.
 * Run: npx playwright test tests/e2e/cta-links.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

// CTA map: page path → [primary target, final target]
const CTA_MAP: Array<{ path: string; primaryHref: string; finalHref: string }> = [
  { path: "/",                   primaryHref: "/request-access",  finalHref: "/pricing" },
  { path: "/product",            primaryHref: "/guided-assessment", finalHref: "/request-access" },
  { path: "/community",          primaryHref: "/self-host",        finalHref: "/self-host" },
  { path: "/cloud",              primaryHref: "/request-access",  finalHref: "/request-access" },
  { path: "/pricing",            primaryHref: "/request-access",  finalHref: "/request-access" },
  { path: "/security",           primaryHref: "/request-access",  finalHref: "/request-access" },
];

test.describe("Page CTA targets", () => {
  for (const { path, primaryHref } of CTA_MAP) {
    test(`${path} has a primary CTA linking to ${primaryHref}`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      const cta = page.locator(`a[href="${primaryHref}"]`).first();
      await expect(cta).toBeVisible();
    });
  }
});

test.describe("No dead CTA patterns", () => {
  const PUBLIC_ROUTES = [
    "/", "/product", "/guided-assessment", "/dataset-audit",
    "/model-assessment", "/compliance-exports", "/community",
    "/cloud", "/pricing", "/security", "/developers", "/docs",
    "/ecosystem", "/openapi", "/self-host", "/request-access",
  ];

  for (const path of PUBLIC_ROUTES) {
    test(`${path} has no href='#' CTAs`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      const badLinks = await page.locator("main a[href='#']").count();
      expect(badLinks).toBe(0);
    });

    test(`${path} has no javascript:void CTAs`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      const badLinks = await page.locator("main a[href*='javascript']").count();
      expect(badLinks).toBe(0);
    });
  }
});

test.describe("External CTA safety", () => {
  const EXTERNAL_CTA_PAGES = ["/developers", "/community", "/ecosystem"];

  for (const path of EXTERNAL_CTA_PAGES) {
    test(`${path} external CTAs open in new tab with noopener`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      const externalLinks = page.locator(`main a[href^='https://']`);
      const count = await externalLinks.count();
      for (let i = 0; i < count; i++) {
        const target = await externalLinks.nth(i).getAttribute("target");
        const rel = await externalLinks.nth(i).getAttribute("rel");
        expect(target).toBe("_blank");
        expect(rel).toContain("noopener");
      }
    });
  }
});

test.describe("Request Access form page", () => {
  test("has submit button", async ({ page }) => {
    await page.goto(`${BASE}/request-access`);
    const submitBtn = page.getByRole("button", { name: /Submit/i });
    await expect(submitBtn).toBeVisible();
  });

  test("has compare editions link", async ({ page }) => {
    await page.goto(`${BASE}/request-access`);
    const link = page.getByRole("link", { name: /Compare/i });
    await expect(link).toBeVisible();
  });
});
