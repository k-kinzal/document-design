// A legible excerpt of the product page, using its actual figure and doc-ui CSS.
import { chromium } from '@playwright/test';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { readingPaths } from './home.mjs';

const temp = mkdtempSync(join(tmpdir(), 'doc-site-social-'));
let browser;
try {
  const pagePath = join(temp, 'social.html');
  writeFileSync(pagePath, `<!doctype html><html lang="en" data-dd-theme="light"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>doc-ui social preview</title><link rel="stylesheet" href="${import.meta.resolve('@k-kinzal/doc-ui')}">
    </head><body><article class="sheet sheet-wide">
      <header class="masthead"><span class="brand">doc-ui</span><span>CSS for documentation &amp; reports</span></header>
      <section class="section"><h1 class="section-title">Information, made clear.</h1>
        <p class="stand">Scan a reference. Read a report.</p>${readingPaths}</section>
    </article></body></html>`);
  browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(pagePath).href);
  await page.screenshot({path:fileURLToPath(new URL('../public/assets/og.png',import.meta.url))});
  console.log('Rendered public/assets/og.png from the product page’s reading-path figure (1200 × 630).');
} finally {
  if (browser) await browser.close();
  rmSync(temp, { recursive: true, force: true });
}
