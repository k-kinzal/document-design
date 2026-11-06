import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

export const PLAYWRIGHT_VERSION = '1.63.0';

// Playwright is optional: only Mermaid and PNG generation need a browser.
export async function loadChromium(purpose = 'PNG output') {
  for (const base of [import.meta.url, pathToFileURL(join(process.cwd(), 'package.json'))]) {
    let entry;
    try { entry = createRequire(base).resolve('playwright'); }
    catch (error) { if (error.code === 'MODULE_NOT_FOUND') continue; throw error; }
    const module = await import(pathToFileURL(entry).href);
    return module.chromium ?? module.default.chromium;
  }
  throw new Error(`${purpose} needs Playwright. Run npm install --save-dev playwright@${PLAYWRIGHT_VERSION}, then npx playwright install chromium.`);
}

// Capture the same screen layout as the HTML, at twice its CSS resolution.
export async function renderImage({ html, baseDir = process.cwd(), width = 960, theme = 'light', chromium, launchOptions = {}, offline = false }) {
  if (!Number.isInteger(width) || width < 320 || width > 2400) throw new Error('Image width must be a whole number from 320 to 2400.');
  chromium ??= await loadChromium();
  const dir = await mkdtemp(join(tmpdir(), 'doc-ui-image-'));
  let browser;
  try {
    const file = join(dir, 'report.html');
    const base = pathToFileURL(resolve(baseDir) + sep).href.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    await writeFile(file, html.replace(/<head(?:\s[^>]*)?>/i, match => `${match}<base href="${base}">`));
    browser = await chromium.launch(launchOptions);
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2, colorScheme: theme === 'dark' ? 'dark' : 'light', reducedMotion: 'reduce', javaScriptEnabled: false, serviceWorkers: 'block' });
    page.setDefaultTimeout(30_000);
    if (offline) await page.route(/^https?:\/\//, route => route.abort());
    await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
    await page.evaluate(() => {
      // Deferred content and lazy images must also appear below the viewport.
      for (const element of document.querySelectorAll('[data-dd-defer]')) element.style.contentVisibility = 'visible';
      for (const image of document.images) image.loading = 'eager';
    });
    await page.waitForFunction(() => document.fonts.status === 'loaded' && Array.from(document.images, image => image.complete).every(Boolean));
    return await page.screenshot({ type: 'png', fullPage: true, animations: 'disabled', timeout: 30_000 });
  } finally {
    try { await browser?.close(); }
    finally { await rm(dir, { recursive: true, force: true }); }
  }
}
