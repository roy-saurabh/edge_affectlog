/**
 * E2E tests for the public homepage.
 * Verifies required content, CTA links, footer, and forbidden terms.
 *
 * Run with: npx playwright test tests/e2e/developer-homepage.spec.ts
 * Requires a running frontend at http://localhost:3000.
 */
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

test.describe("Public homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("renders hero title", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Trustworthy AI assessment"
    );
  });

  test("has primary CTA: Request Managed Access", async ({ page }) => {
    const link = page.getByRole("link", { name: /Request Managed Access/i }).first();
    await expect(link).toBeVisible();
  });

  test("has secondary CTA: Deploy Community Edition", async ({ page }) => {
    const link = page.getByRole("link", { name: /Deploy Community Edition/i }).first();
    await expect(link).toBeVisible();
  });

  test("has Prometheus-X ecosystem section", async ({ page }) => {
    await expect(page.getByText(/Prometheus-X Trustworthy AI Ecosystem/i)).toBeVisible();
  });

  test("shows Prometheus-X BB04 in ecosystem section", async ({ page }) => {
    await expect(page.getByText(/Prometheus-X BB04/i).first()).toBeVisible();
  });

  test("shows EDGE-Skills in ecosystem section", async ({ page }) => {
    await expect(page.getByText(/EDGE-Skills/i).first()).toBeVisible();
  });

  test("footer contains EU funding acknowledgement", async ({ page }) => {
    await expect(page.locator("footer").getByText(/Digital Europe Programme/i)).toBeVisible();
  });

  test("footer links to Prometheus-X BB04", async ({ page }) => {
    const link = page.locator("footer").getByRole("link", { name: /Prometheus-X BB04/i });
    await expect(link.first()).toBeVisible();
  });

  test("footer links to EDGE-Skills EU project", async ({ page }) => {
    const link = page.locator("footer").getByRole("link", { name: /EDGE-Skills/i });
    await expect(link.first()).toBeVisible();
  });

  test("footer links to GitHub repository", async ({ page }) => {
    const link = page.locator("footer").getByRole("link", { name: /GitHub/i });
    await expect(link.first()).toBeVisible();
    await expect(link.first()).toHaveAttribute("href", /github\.com/);
  });

  test("developer contribution section is present", async ({ page }) => {
    await expect(page.getByText(/Build reusable assessment infrastructure/i)).toBeVisible();
  });

  test("developer CTA links to GitHub", async ({ page }) => {
    await expect(page.getByRole("link", { name: /View on GitHub/i })).toBeVisible();
  });

  // ── Forbidden terms ────────────────────────────────────────────────────
  const FORBIDDEN = ["D3.7", "TRL", "reporting period"];

  for (const term of FORBIDDEN) {
    test(`homepage does not contain forbidden term: "${term}"`, async ({ page }) => {
      const content = await page.content();
      expect(content).not.toContain(term);
    });
  }

  test("does not imply exploratory-only status", async ({ page }) => {
    const content = await page.content();
    const forbiddenPhrases = ["proof of concept", "work in progress", "not yet ready"];
    for (const phrase of forbiddenPhrases) {
      expect(content.toLowerCase()).not.toContain(phrase);
    }
  });
});

test.describe("Auth pages", () => {
  test("login page renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();
  });

  test("register page renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await expect(page.getByRole("heading", { name: /Request Access/i })).toBeVisible();
  });

  test("awaiting approval page renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/awaiting-approval`);
    await expect(page.getByText(/awaiting administrator review/i)).toBeVisible();
  });
});
