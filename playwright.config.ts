import { defineConfig } from "@playwright/test";

const baseURL = process.env.DEMO_URL;
if (!baseURL) throw new Error("Set DEMO_URL to the production URL before running the e2e tests.");

export default defineConfig({
  testDir: "./e2e",
  timeout: 180_000,
  retries: 0,
  reporter: [["list"]],
  use: { actionTimeout: 15_000, baseURL, viewport: { width: 1280, height: 800 }, trace: "retain-on-failure" },
});
