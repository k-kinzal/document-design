import { test, expect } from '@playwright/test';
import { components } from '../src/components.mjs';
import { localePath } from '../src/i18n.mjs';

for (const lang of ['en', 'ja']) for (const colorScheme of ['light', 'dark']) {
  test(`publication alignment and flow clearance: ${lang}, ${colorScheme}`, async ({ page }, info) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/' + localePath('', lang));
    for (const width of [1440, 900, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const m = await page.evaluate(() => {
        const box = selector => document.querySelector(selector).getBoundingClientRect();
        const style = selector => getComputedStyle(document.querySelector(selector));
        const figure = box('#reading-paths .plate-body');
        const divider = getComputedStyle(document.querySelector('#reading-paths .compare'), '::before');
        return {
          starts: ['#language-title', '#building-title', '#components-title', '.plate-summary'].map(s => box(s).x),
          headings: [...document.querySelectorAll('main > section .section-title')].map(e => {
            const s = getComputedStyle(e);
            return [e.tagName, s.fontSize, s.fontWeight, s.lineHeight];
          }),
          figureGap: box('#reading-paths').top - box('#layouts-title').bottom,
          proseGap: box('#language .prose').top - box('#language-title').bottom,
          noteGap: box('#building .note').top - box('#building-title').bottom,
          boundary: [style('.ribbon').borderBottomWidth, style('#layouts').borderTopWidth],
          panels: ['#path-reference', '#path-paper'].map(s => box(s).width),
          divider: { content: divider.content, x: figure.x + parseFloat(divider.left), center: figure.x + figure.width / 2 },
          figureHeight: figure.height,
          coverStacked: box('.cover-copy').top >= box('.cover > div').bottom,
          tracking: parseFloat(style('.cover-title').letterSpacing) / parseFloat(style('.cover-title').fontSize),
          flows: [...document.querySelectorAll('.flow > li:not(:last-child)')].map(li => {
            const line = getComputedStyle(li, '::after'), head = getComputedStyle(li, '::before');
            const rect = li.getBoundingClientRect();
            const name = li.querySelector('.flow-name').getBoundingClientRect();
            const detail = li.querySelector('.flow-detail').getBoundingClientRect();
            const mark = li.querySelector('.flow-mark').getBoundingClientRect();
            return {
              vertical: parseFloat(line.borderLeftWidth) > 0,
              lineX: rect.x + parseFloat(line.left), headRight: rect.x + parseFloat(head.left) + parseFloat(head.width),
              lineY: rect.y + parseFloat(line.top), nameX: name.x, nameY: name.y,
              detailX: detail.x, markLeft: mark.left, markRight: mark.right,
            };
          }),
        };
      });
      expect(new Set(m.headings.map(h => JSON.stringify(h))).size).toBe(1);
      expect(m.headings[0][0]).toBe('H2');
      expect(m.figureGap).toBeCloseTo(24, 0);
      expect(m.proseGap).toBeCloseTo(14, 0);
      expect(m.noteGap).toBeCloseTo(14, 0);
      expect(m.boundary).toEqual(['1px', '0px']);
      expect(m.tracking).toBeCloseTo(lang === 'ja' ? -0.02 : -0.04, 3);
      expect(Math.max(...m.starts) - Math.min(...m.starts)).toBeLessThan(1);
      if (width >= 900) {
        expect(m.panels[0]).toBeCloseTo(m.panels[1], 0);
        expect(m.divider.content).toBe('""');
        expect(m.divider.x).toBeCloseTo(m.divider.center, 0);
      }
      if (width <= 900) expect(m.coverStacked).toBe(true);
      for (const flow of m.flows) {
        if (flow.vertical) {
          expect(flow.lineX).toBeGreaterThanOrEqual(flow.markLeft);
          expect(flow.lineX).toBeLessThanOrEqual(flow.markRight);
          expect(flow.headRight).toBeLessThan(flow.nameX);
          expect(flow.detailX).toBe(flow.nameX);
        } else expect(flow.lineY).toBeLessThan(flow.nameY);
      }
      if (width === 390) {
        expect(m.figureHeight).toBeLessThan(680);
        await page.locator('#reading-paths').screenshot({ path: info.outputPath(`flow-${lang}-${colorScheme}.png`) });
      }
      if ([1440, 900, 390].includes(width)) await page.screenshot({ path: info.outputPath(`home-${width}.png`), fullPage: true });
    }
  });
}

for (const lang of ['en', 'ja']) {
  test(`gallery previews keep text and controls inside their frames: ${lang}`, async ({ page }, info) => {
    await page.goto('/' + localePath('components/', lang));
    for (const width of [1440, 900, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const clipped = await page.locator('.card-preview').evaluateAll(previews => previews.flatMap(preview => {
        const frame = preview.getBoundingClientRect();
        const bottom = frame.bottom - parseFloat(getComputedStyle(preview).borderBottomWidth);
        return [...preview.querySelectorAll('*')].filter(el => {
          if (!el.checkVisibility() || (!el.matches('button, .btn, input, select') && (el.children.length || !el.textContent.trim()))) return false;
          const rect = el.getBoundingClientRect();
          return rect.top < bottom - 1 && rect.bottom > bottom + 1;
        }).map(el => ({ component: preview.closest('.card').querySelector('.card-link').textContent, text: el.textContent.trim() }));
      }));
      expect(clipped, `${lang}, ${width}px`).toEqual([]);
      for (const component of components.filter(c => c.previewHeight === 'auto')) {
        const card = page.locator('.card').filter({ has: page.locator(`.card-link[href="./${component.slug}/index.html"]`) });
        const preview = card.locator('.card-preview').first();
        expect((await preview.boundingBox()).height).toBeGreaterThanOrEqual(224);
        expect(await preview.evaluate(el => el.scrollHeight <= el.clientHeight + 1), `${component.slug}, ${width}px`).toBe(true);
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: info.outputPath(`gallery-${lang}.png`) });
  });
}

test('report leads attach equally to prose and notes', async ({ page }) => {
  await page.goto('/components/report/');
  await page.locator('.specimen-body').first().evaluate(el => {
    el.innerHTML = '<article class="sheet sheet-inset"><p class="lead">A claim.</p><div class="prose"><p>Its evidence.</p></div><p class="lead">Another claim.</p><p class="note">Its evidence.</p></article>';
  });
  const gaps = await page.locator('.specimen-body').first().locator('.lead').evaluateAll(leads => leads.map(el => el.nextElementSibling.getBoundingClientRect().top - el.getBoundingClientRect().bottom));
  expect(gaps).toEqual([14, 14]);
});
