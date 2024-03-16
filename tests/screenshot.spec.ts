import { test, expect } from '@playwright/test';
import { Page } from "@playwright/test";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const scrollThroughPage = async (page: Page) => {
  const sizes = await page.evaluate(() => {
    const browserHeight = window.innerHeight;
    const pageHeight = document.body.scrollHeight;

    return { browserHeight, pageHeight };
  });

  for (let i = 0; i < sizes.pageHeight; i += sizes.browserHeight) {
    await page.mouse.wheel(0, i);
    await delay(250);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
};


test.setTimeout(180000);
test('capture screenshot', async ({ page }) => {
  await page.goto(`https://tempo.fit`, {
    waitUntil: "networkidle",
  });

  await scrollThroughPage(page);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.fonts.ready);
  await delay(10000);
  await page.keyboard.down('Escape');
  await page.keyboard.down('Escape');
  await page.keyboard.down('Escape');
  await scrollThroughPage(page);
  await delay(10000);

  await expect(page).toHaveScreenshot({
    fullPage: true
  });
});
