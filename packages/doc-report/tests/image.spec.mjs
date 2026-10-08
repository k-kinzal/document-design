import { test, expect } from '@playwright/test';
import { renderImage } from '@k-kinzal/doc-ui/image';
import { renderSample } from './fixtures/sample.mjs';

for (const language of ['en', 'ja']) {
  test(`${language}: the report PNG includes the whole rendered report`, async ({ playwright }) => {
    const html = renderSample({ language });
    const png = await renderImage({ html, chromium: playwright.chromium, offline: true });
    expect(png.readUInt32BE(16)).toBe(1920);
    expect(png.readUInt32BE(20)).toBeGreaterThan(1800);
    const browser = await playwright.chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 960, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light', javaScriptEnabled: false, reducedMotion: 'reduce' });
      await page.setContent(html);
      await expect(page.locator('#sec-provenance')).toBeVisible();
      const expected = await page.screenshot({ fullPage: true, animations: 'disabled' });
      expect(png.equals(expected), 'capture preserves the HTML through the last provenance section').toBe(true);
    } finally { await browser.close(); }
  });
}
