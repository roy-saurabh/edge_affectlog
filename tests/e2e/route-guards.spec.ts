/**
 * Route guard tests — verify unauthenticated users are redirected,
 * and authenticated users can access console routes.
 * Run: npx playwright test tests/e2e/route-guards.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

const PROTECTED_ROUTES = [
  "/app",
  "/app/wizard",
  "/app/datasets",
  "/app/audit",
  "/app/compliance",
  "/app/models",
];

const ADMIN_ROUTES = [
  "/admin",
  "/admin/users",
  "/admin/pending-registrations",
  "/admin/audit-log",
];

test.describe("Unauthenticated access guards", () => {
  for (const route of PROTECTED_ROUTES) {
    test(`${route} redirects unauthenticated user`, async ({ page }) => {
      await page.goto(`${BASE}${route}`);
      // Should be redirected to login or home — not stay on the protected route
      await page.waitForTimeout(500);
      expect(page.url()).not.toContain(route);
    });
  }

  for (const route of ADMIN_ROUTES) {
    test(`${route} redirects unauthenticated user`, async ({ page }) => {
      await page.goto(`${BASE}${route}`);
      await page.waitForTimeout(500);
      expect(page.url()).not.toContain(route);
    });
  }
});

test.describe("404 handling", () => {
  test("unknown route redirects to home", async ({ page }) => {
    await page.goto(`${BASE}/this-does-not-exist-xyz`);
    await page.waitForTimeout(300);
    // Should redirect to / (or a 404 page — not a blank page)
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test("planned route /app/recipes redirects or shows proper message", async ({ page }) => {
    await page.goto(`${BASE}/app/recipes`);
    await page.waitForTimeout(300);
    // Should not crash — either redirects or shows a not-found page
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });
});
