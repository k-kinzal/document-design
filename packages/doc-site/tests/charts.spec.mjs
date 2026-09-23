import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const charts = ['bar-chart', 'comparison-plot', 'line-plot', 'histogram', 'flow-graph'];
const axePath = fileURLToPath(import.meta.resolve('axe-core/axe.min.js'));

test('the visual index shows complete plot previews without shrinking type', async ({page}, info) => {
  await page.goto('/components/');
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({width,height:1000});
    for (const name of ['Comparison plot','Line plot','Histogram','Flow graph']) {
      const card = page.locator('.card').filter({has:page.getByRole('link',{name,exact:true})});
      const preview = card.locator('.card-preview'), svg = preview.locator('svg.draw');
      const frame = await preview.boundingBox(), drawing = await svg.boundingBox();
      expect(drawing.x).toBeGreaterThanOrEqual(frame.x);
      expect(drawing.x + drawing.width).toBeLessThanOrEqual(frame.x + frame.width);
      expect(drawing.y + drawing.height).toBeLessThanOrEqual(frame.y + frame.height);
      expect(await svg.evaluate(n => n.getScreenCTM().a)).toBe(1);
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('#group-2').screenshot({path:info.outputPath('graph-index.png')});
});

test('bar geometry preserves the common scale at wide and narrow widths', async ({page}, info) => {
  await page.goto('/components/bar-chart/');
  const list = page.locator('.specimen .bars').first();
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({width,height:1000});
    const tracks = await list.locator('.bar-track').evaluateAll(nodes => nodes.map(n => n.getBoundingClientRect().width));
    expect(Math.max(...tracks) - Math.min(...tracks)).toBeLessThan(1);
    const fills = await list.locator('.bar-fill').evaluateAll(nodes => nodes.map(n => n.getBoundingClientRect().width));
    expect(fills[0] / fills[1]).toBeCloseTo(8, 1);
    for (const node of await list.locator('.bar-label, .bar-value').all()) {
      expect(await node.evaluate(n => n.scrollWidth <= n.clientWidth + 1)).toBe(true);
    }
    if (width === 1440 || width === 320) await page.locator('.specimen').first().screenshot({path:info.outputPath(`bars-${width}.png`)});
  }
  const missing = page.locator('.specimen .bars').nth(1);
  expect((await missing.locator('.bar-fill').boundingBox()).width).toBe(0);
  await expect(missing.locator('.is-missing .bar-fill')).toHaveCount(0);
  await expect(missing).toContainText('Not measured');
});

for (const slug of charts.slice(1)) {
  test(`${slug}: fixed readable type, full labels, keyboard scrolling and paper fit`, async ({page}, info) => {
    await page.goto(`/components/${slug}/`);
    const figures = page.locator('.specimen .plate');
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({width,height:1000});
      const measurements = await figures.locator('svg.draw').evaluateAll(nodes => nodes.map(svg => ({
        scale: svg.getScreenCTM().a,
        labels: [...svg.querySelectorAll('text')].map(t => {
          const box = t.getBBox();
          return {size:parseFloat(getComputedStyle(t).fontSize),left:box.x,right:box.x+box.width,top:box.y,bottom:box.y+box.height};
        }),
        width:svg.viewBox.baseVal.width,height:svg.viewBox.baseVal.height,
      })));
      for (const m of measurements) {
        expect(m.scale).toBe(1);
        for (const label of m.labels) {
          expect(label.size).toBeGreaterThanOrEqual(14);
          expect(label.left).toBeGreaterThanOrEqual(0);
          expect(label.right).toBeLessThanOrEqual(m.width);
          expect(label.top).toBeGreaterThanOrEqual(0);
          expect(label.bottom).toBeLessThanOrEqual(m.height);
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      if (width === 1440) await figures.first().screenshot({path:info.outputPath(`${slug}-light.png`)});
    }
    const region = figures.first().getByRole('region');
    await region.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => region.evaluate(n => n.scrollLeft)).toBeGreaterThan(0);
    await page.emulateMedia({media:'print'});
    for (const svg of await figures.locator('svg.draw').all()) {
      expect(await svg.evaluate(n => n.getBoundingClientRect().width <= n.parentElement.clientWidth + 1)).toBe(true);
    }
    await expect(figures.first().locator('figcaption')).toBeVisible();
  });
}

test('gaps stay open and paired observations keep distinct marker shapes', async ({page}) => {
  await page.goto('/components/line-plot/');
  const gap = page.locator('.specimen .plate').nth(1);
  await expect(gap.locator('.plot-line')).toHaveCount(0);
  await expect(gap.locator('.plot-missing')).toHaveCount(1);
  await expect(gap).toContainText('Not recorded');
  await page.goto('/components/comparison-plot/');
  const before = page.locator('.specimen .plot-before'), after = page.locator('.specimen .plot-point');
  await page.emulateMedia({forcedColors:'active'});
  expect(await before.evaluate(n => getComputedStyle(n).fill)).not.toBe(await after.evaluate(n => getComputedStyle(n).fill));
});

test('flow nodes share dimensions and weight; branch labels have no surface-dependent halo', async ({page}, info) => {
  for (const scheme of ['light','dark']) {
    await page.emulateMedia({colorScheme:scheme});
    for (const compact of [false,true]) {
      await page.goto(compact ? '/components/' : '/components/flow-graph/');
      const svg = compact
        ? page.locator('.card').filter({has:page.getByRole('link',{name:'Flow graph',exact:true})}).locator('svg.draw')
        : page.locator('.specimen svg.draw');
      const nodes = await svg.locator('.node-action, .node-decision, .node-terminal').evaluateAll(nodes => nodes.map(n => {
        const b=n.getBBox(),s=getComputedStyle(n);
        return {width:b.width,height:b.height,stroke:s.strokeWidth};
      }));
      expect(nodes.length).toBeGreaterThanOrEqual(3);
      expect(new Set(nodes.map(n=>n.width)).size).toBe(1);
      expect(new Set(nodes.map(n=>n.height)).size).toBe(1);
      expect(new Set(nodes.map(n=>n.stroke)).size).toBe(1);
      const titleWeights = await svg.locator('.draw-strong').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).fontWeight));
      expect(titleWeights.length).toBe(nodes.length);
      expect(new Set(titleWeights).size).toBe(1);
      const outlines = await svg.locator('.edge-label').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).stroke));
      expect(outlines.every(stroke=>stroke==='none')).toBe(true);
      await svg.screenshot({path:info.outputPath(`flow-${compact?'compact':'full'}-${scheme}.png`)});
    }
  }
});

test('all chart patterns remain readable in dark and forced palettes', async ({page}, info) => {
  for (const slug of charts) {
    await page.emulateMedia({colorScheme:'dark',forcedColors:'none'});
    await page.goto(`/components/${slug}/`);
    await page.addScriptTag({path:axePath});
    expect(await page.evaluate(async () => (await axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})))).toEqual([]);
    await page.locator('.specimen').first().screenshot({path:info.outputPath(`${slug}-dark.png`)});
    await page.emulateMedia({forcedColors:'active'});
    await page.locator('.specimen').first().screenshot({path:info.outputPath(`${slug}-forced.png`)});
    const marks = await page.locator('.specimen .plot-line, .specimen .plot-bin, .specimen .edge-flow').evaluateAll(nodes => nodes.map(n=>({stroke:getComputedStyle(n).stroke,fill:getComputedStyle(n).fill})));
    for (const mark of marks) expect(mark.stroke).not.toBe('none');
  }
});

test('chart examples work offline without JavaScript and print without background fills', async ({browser}, info) => {
  const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:1000,height:900}});
  const page = await context.newPage();
  for (const slug of charts) {
    await page.goto(new URL(`../dist/components/${slug}/index.html`, import.meta.url).href);
    await expect(page.locator('.specimen .plate').first()).toBeVisible();
    await expect(page.locator('.specimen .plate-source').first()).toBeVisible();
    await page.emulateMedia({media:'print'});
    await page.pdf({path:info.outputPath(`${slug}.pdf`),format:'A4',printBackground:false});
    await page.emulateMedia({media:'screen'});
  }
  await context.close();
});
