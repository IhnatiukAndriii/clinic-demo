import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { FrameRecorder } from "./frames";

const DEMO_EMAIL = "demo@implants.example";
const DEMO_PASSWORD = "demo-admin-2026";
const CLINIC_NAME = `Playwright Test Clinic ${Date.now().toString().slice(-6)}`;
const PHOTOS = ["clinic-1.jpg", "clinic-2.jpg"].map((name) => path.resolve("public/demo", name));
const SCREENSHOT_DIR = "artifacts";

async function fillTier(page: Page, legend: string, from: string, to: string, unit: string, inclusions: string[]) {
  const tier = page.getByRole("group", { name: legend });
  await tier.getByRole("checkbox").check();
  await tier.getByLabel("Price from (AUD)").fill(from);
  await tier.getByLabel(/Price up to/).fill(to);
  await tier.getByLabel("Price is").fill(unit);
  for (const item of inclusions) {
    await tier.getByLabel(`New inclusion for ${legend}`).fill(item);
    await tier.getByRole("button", { name: /Add/ }).click();
  }
}

async function shootBothWidths(page: Page, url: string, name: string) {
  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${name}-${width}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 1280, height: 800 });
}

test("admin flow on the production demo", async ({ page }) => {
  const rec = new FrameRecorder(page, "artifacts/frames");
  let clinicSlug = "";

  await test.step("1. Log in at /admin with the demo account", async () => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await rec.pause();
    await page.getByLabel("Email").fill(DEMO_EMAIL);
    await page.getByLabel("Password").fill(DEMO_PASSWORD);
    await rec.capture(1);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).not.toHaveURL(/login/);
    await expect(page.getByRole("link", { name: "Clinics" })).toBeVisible();
    await rec.pause();
  });

  await test.step("2. Add a published clinic with two price tiers and two photos", async () => {
    await page.goto("/admin/clinics/new");
    await rec.pause();
    await page.getByLabel("Clinic name").fill(CLINIC_NAME);
    await page.getByLabel("City").fill("Hoi An");
    await page.getByLabel("Description").fill("Added through the admin by the Playwright run.\nFull implant care with a local team.");
    await fillTier(page, "Single implant", "1200", "1600", "per implant", ["Consultation", "Airport transfer"]);
    await fillTier(page, "Full arch (All-on-4)", "6500", "8500", "per arch", ["3D scan", "Temporary teeth"]);
    await page.getByLabel("Add photos").setInputFiles(PHOTOS);
    await expect(page.locator('input[name="newPhoto"]')).toHaveCount(2);
    await page.getByLabel("Show this clinic on the website").check();
    await rec.capture(1.5);
    await page.getByRole("button", { name: "Save clinic" }).click();
    await page.waitForURL(/\/admin\/clinics(\/|$)/);
    await page.goto("/admin/clinics");
    await expect(page.getByText(CLINIC_NAME).first()).toBeVisible();
    await rec.pause();
    const href = await page.getByRole("link", { name: new RegExp(`Edit.*${CLINIC_NAME}`) }).getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href as string);
    clinicSlug = await page.getByLabel(/Web address/).inputValue();
    await expect(page.getByAltText(new RegExp(`Photo [12] of ${CLINIC_NAME}`))).toHaveCount(2);
  });

  await test.step("3. The clinic shows in the table and the cards on the treatment page", async () => {
    await page.goto("/treatments/dental-implants");
    await rec.pause();
    const table = page.getByRole("table");
    await expect(table.getByText(CLINIC_NAME).first()).toBeVisible();
    await table.scrollIntoViewIfNeeded();
    await rec.capture(1.5);
    const cards = page.locator("#clinics");
    await expect(cards.getByText(CLINIC_NAME).first()).toBeVisible();
    await cards.scrollIntoViewIfNeeded();
    await rec.pause();
  });

  await test.step("4. An enquiry from the new clinic profile reaches /admin/enquiries", async () => {
    await page.goto(`/clinics/${clinicSlug}`);
    await expect(page.getByRole("heading", { name: CLINIC_NAME })).toBeVisible();
    await rec.pause();
    await page.getByLabel("Your name").fill("Playwright Patient");
    await page.getByLabel("Email").fill("patient@example.com");
    await page.getByLabel("Best way to reach you").selectOption({ index: 1 });
    await page.getByLabel("Your message").fill("I would like a quote for a single implant.");
    await rec.capture(1.5);
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByText("Request sent")).toBeVisible();
    await rec.capture(1.5);
    await page.goto("/admin/enquiries");
    await expect(page.getByRole("link", { name: "Playwright Patient" })).toBeVisible();
    await expect(page.getByText(CLINIC_NAME).first()).toBeVisible();
    await rec.pause();
  });

  rec.encode("demo-admin-flow.gif");

  await test.step("Full-page screenshots at 1280px and 375px", async () => {
    await shootBothWidths(page, "/treatments/dental-implants", "treatment-page");
    await shootBothWidths(page, `/clinics/${clinicSlug}`, "clinic-profile");
  });

  await test.step("5. Reset demo data restores the seed state", async () => {
    await page.goto("/admin/clinics");
    await page.getByRole("button", { name: "Reset demo data" }).click({ timeout: 10_000 });
    await expect(page.getByText(CLINIC_NAME)).toHaveCount(0);
    await page.goto("/admin/enquiries");
    await expect(page.getByRole("link", { name: "Playwright Patient" })).toHaveCount(0);
  });
});
