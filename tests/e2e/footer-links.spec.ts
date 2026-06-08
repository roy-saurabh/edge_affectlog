/**
 * Footer link validation tests.
 * Verifies every footer link has a valid href and no dead links.
 * Run: npx playwright test tests/e2e/footer-links.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

test.describe("Footer internal links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  const INTERNAL_FOOTER_LINKS = [
    "/product",
    "/guided-assessment",
    "/dataset-audit",
    "/model-assessment",
    "/compliance-exports",
    "/community",
    "/cloud",
    "/pricing",
    "/security",
    "/self-host",
    "/developers",
    "/openapi",
    "/docs",
  ];

  for (const path of INTERNAL_FOOTER_LINKS) {
    test(`footer contains link to ${path}`, async ({ page }) => {
      const link = page.locator(`footer a[href="${path}"]`);
      await expect(link.first()).toBeVisible();
    });
  }

  test("footer has no href='#' links", async ({ page }) => {
    const badLinks = await page.locator("footer a[href='#']").count();
    expect(badLinks).toBe(0);
  });

  test("footer has no javascript:void links", async ({ page }) => {
    const badLinks = await page.locator("footer a[href*='javascript']").count();
    expect(badLinks).toBe(0);
  });
});

test.describe("Footer external links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
  });

  test("external links have target=_blank", async ({ page }) => {
    const externalLinks = page.locator("footer a[href^='https://']");
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(externalLinks.nth(i)).toHaveAttribute("target", "_blank");
    }
  });

  test("external links have rel=noopener noreferrer", async ({ page }) => {
    const externalLinks = page.locator("footer a[href^='https://']");
    const count = await externalLinks.count();
    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute("rel");
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });

  test("GitHub link points to canonical Prometheus-X repo", async ({ page }) => {
    const ghLink = page.locator("footer a[href*='github.com/Prometheus-X-association']").first();
    await expect(ghLink).toBeVisible();
  });

  test("footer has EU funding note", async ({ page }) => {
    await expect(page.locator("footer").getByText(/Digital Europe Programme/i)).toBeVisible();
  });
});

test.describe("Footer CTA band", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test("CTA band has Request Managed Access link", async ({ page }) => {
    const cta = page.locator("footer").getByRole("link", { name: /Request Managed Access/i });
    await expect(cta).toHaveAttribute("href", "/request-access");
  });

  test("CTA band has Deploy Community Edition link", async ({ page }) => {
    const cta = page.locator("footer").getByRole("link", { name: /Deploy Community Edition/i });
    await expect(cta).toHaveAttribute("href", "/self-host");
  });
});
