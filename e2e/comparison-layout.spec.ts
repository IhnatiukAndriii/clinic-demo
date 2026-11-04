import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { width: 1280, height: 800, rows: "#compare tbody tr" },
  { width: 375, height: 800, rows: "#compare ul > li" },
];

for (const { width, height, rows } of VIEWPORTS) {
  test(`comparison section fits the page at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/treatments/dental-implants");
    await page.waitForLoadState("networkidle");
    const section = page.locator("#compare");
    await expect(section).toBeVisible();

    const items = page.locator(rows);
    await expect(items).toHaveCount(4);
    for (let index = 0; index < 4; index++) {
      await expect(items.nth(index)).toBeVisible();
    }

    const scrollers = await section.evaluate((root) =>
      [root, ...root.querySelectorAll<HTMLElement>("*")]
        .filter((el) => {
          const { overflowY } = getComputedStyle(el);
          return (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight;
        })
        .map((el) => el.tagName + "." + el.className),
    );
    expect(scrollers).toEqual([]);

    const clipped = await items.evaluateAll((els) =>
      els.filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1).length,
    );
    expect(clipped).toBe(0);

    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflowX).toBeLessThanOrEqual(0);

    await section.scrollIntoViewIfNeeded();
    await section.screenshot({ path: `artifacts/comparison-${width}.png` });
  });
}
