import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "../../../tests/e2e",
  timeout: 30_000,
  retries: 1,
  reporter: [["html", { outputFolder: "playwright-report" }], ["line"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    ...devices["Desktop Chrome"],
  },
});
