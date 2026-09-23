import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { components } from '../src/components.mjs';
import { locales, localePath, localizeHTML } from '../src/i18n.mjs';

const axePath = fileURLToPath(import.meta.resolve('axe-core/axe.min.js'));
for (const lang of locales) for (const route of ['', 'start/', 'components/', ...components.map(c => `components/${c.slug}/`)]) {
  const path = '/' + localePath(route, lang);
  test(`page is readable and accessible: ${path}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    expect((await page.goto(path)).status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    if (lang === 'en') expect((await page.locator('body').innerText()).replace('日本語', '')).not.toMatch(/[ぁ-んァ-ン一-龯]/);
    else expect(await page.locator('main').innerText()).toMatch(/[ぁ-んァ-ン一-龯]/);
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } })).violations.map(v => ({ id:v.id, targets:v.nodes.map(n=>n.target) })));
    expect(violations).toEqual([]);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({width,height:1000});
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow at ${width}px on ${path}`).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test('gallery contains a real preview for every component', async ({page}) => {
  await page.goto('/components/');
  await expect(page.locator('.card-preview')).toHaveCount(components.length);
  for (const preview of await page.locator('.card-preview').all()) expect(await preview.locator(':scope > *').count()).toBeGreaterThan(0);
  await page.locator('.card').getByRole('link',{name:'Chip',exact:true}).click();
  await expect(page).toHaveURL(/components\/chip\/index.html$/);
});

test('highlighted HTML preserves source when copied', async ({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/components/chip/');
  expect(await page.locator('#source-0 .tok-kw').count()).toBeGreaterThan(0);
  expect(await page.locator('#source-0 .tok-str').count()).toBeGreaterThan(0);
  await page.locator('[data-dd-copy="#source-0"]').click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(components.find(c=>c.slug==='chip').examples[0].html);
});

test('search reaches a component and supports keyboard navigation', async ({page})=>{
  await page.goto('/components/');
  await page.keyboard.press('/');
  await expect(page.locator('[data-dd-search]')).toBeFocused();
  await page.locator('[data-dd-search]').fill('Chip');
  await expect(page.locator('[data-dd-search-results]')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/components\/chip\/index.html$/);
});

test('filters, sorting, tabs, theme and mobile navigation work', async ({page})=>{
  await page.goto('/components/facets/');
  await page.locator('[data-dd-facet="kind:insert"]').click();
  await expect(page.locator('#facet-items .row:visible')).toHaveCount(1);
  await page.locator('[data-dd-facet-clear]').click();
  await expect(page.locator('#facet-items .row:visible')).toHaveCount(3);
  await page.goto('/components/table/');
  await page.locator('.specimen th.num').click();
  await expect(page.locator('.specimen tbody tr:first-child .num')).toHaveText('3');
  await page.goto('/components/tabs/');
  await page.getByRole('tab',{name:'CSS',exact:true}).click();
  await expect(page.locator('#sample-css')).toBeVisible();
  await expect(page.locator('#sample-html')).toBeHidden();
  await page.locator('.topbar [data-dd-theme-toggle]').click();
  await page.locator('.topbar [data-dd-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-dd-theme','dark');
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Open navigation'}).click();
  await expect(page.locator('#navigation')).toBeVisible();
  await expect(page.locator('[data-dd-nav-toggle]')).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Escape');
  await expect(page.locator('#navigation')).toBeHidden();
});

test('dark theme remains accessible',async({page})=>{
  await page.emulateMedia({colorScheme:'dark'});
  for(const path of ['/','/components/','/components/chip/','/ja/','/ja/components/','/ja/components/prose/']){
    await page.goto(path); await page.addScriptTag({path:axePath});
    expect(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))).toEqual([]);
  }
});

test('language links keep the same route and local navigation keeps the chosen language', async ({page}) => {
  for (const route of ['', 'start/', 'components/', 'components/prose/', 'components/report/']) {
    await page.goto('/' + route);
    await page.getByRole('link', {name:'日本語', exact:true}).click();
    await expect(page).toHaveURL(new RegExp(`/ja/${route}index.html$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await page.getByRole('link', {name:'English', exact:true}).click();
    await expect(page).toHaveURL(new RegExp(`4174/${route}index.html$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  }
  await page.goto('/ja/components/prose/');
  await page.locator('#navigation a').filter({hasText:/^Report$/}).click();
  await expect(page).toHaveURL(/\/ja\/components\/report\/index.html$/);
});

test('Japanese search, copy feedback and themes use the page language', async ({page,context}) => {
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/ja/components/');
  const search = page.getByRole('searchbox', {name:'コンポーネントを検索'});
  await search.fill('分類');
  await page.locator('[data-dd-search-results]').getByRole('link', {name:/Chip/}).click();
  await expect(page).toHaveURL(/\/ja\/components\/chip\/index.html$/);
  await search.fill('zzzzzzzz');
  await expect(page.locator('.search-empty')).toHaveText('該当する項目はありません。');
  await page.keyboard.press('Escape');
  await page.locator('[data-dd-copy="#source-1"]').click();
  await expect(page.locator('[data-dd-copy="#source-1"]')).toHaveText('コピーしました');
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(localizeHTML(components.find(c=>c.slug==='chip').examples[1].html));
  await expect(page.locator('.topbar [data-dd-theme-toggle]')).toHaveAttribute('aria-label', 'テーマ：自動');
  await page.locator('.topbar [data-dd-theme-toggle]').click();
  await expect(page.locator('.topbar [data-dd-theme-toggle]')).toHaveAttribute('aria-label', 'テーマ：ライト');
});

test('Japanese typography activates without applying proportional metrics to body text', async ({page}, info) => {
  for (const lang of locales) {
    await page.goto('/' + localePath('components/prose/', lang));
    const type = await page.locator('.specimen .prose').evaluate(el => {
      const heading = getComputedStyle(el.querySelector('h3'));
      const body = getComputedStyle(el.querySelector('p'));
      return {heading:heading.fontFeatureSettings, body:body.fontFeatureSettings, breaks:heading.wordBreak, lineBreak:body.lineBreak, autospace:body.textAutospace, measure:el.querySelector('p').getBoundingClientRect().width};
    });
    expect(type.heading).toContain('"palt"');
    expect(type.body).toBe('normal');
    expect(type.breaks).toBe(lang === 'ja' ? 'auto-phrase' : 'normal');
    expect(type.lineBreak).toBe('strict');
    expect(type.autospace).toBe('normal');
    expect(type.measure).toBe(576);
    await page.locator('.specimen').screenshot({path:info.outputPath(`prose-${lang}.png`)});
    await page.goto('/' + localePath('', lang));
    await page.screenshot({path:info.outputPath(`home-${lang}.png`),fullPage:true});
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:info.outputPath(`home-${lang}-mobile.png`),fullPage:true});
    await page.setViewportSize({width:1440,height:1000});
  }
});

test('language switching and Japanese examples work from disk without JavaScript', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page = await context.newPage();
  await page.goto(new URL('../dist/components/prose/index.html',import.meta.url).href);
  await page.getByRole('link',{name:'日本語',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','ja');
  await expect(page.locator('.specimen')).toContainText('情報を見やすくする');
  await expect(page.locator('#navigation')).toBeVisible();
  await page.getByRole('link',{name:'English',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await context.close();
});

test('no JavaScript and file URLs preserve content and navigation',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(new URL('../dist/components/tabs/index.html',import.meta.url).href);
  await expect(page.locator('#sample-html')).toBeVisible();
  await expect(page.locator('#sample-css')).toBeVisible();
  await expect(page.locator('#navigation')).toBeVisible();
  await expect(page.locator('[data-dd-copy]').first()).toBeHidden();
  await page.locator('#navigation a').filter({hasText:/^Chip$/}).click();
  await expect(page).toHaveURL(/components\/chip\/index.html$/);
  expect(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  await context.close();
});

test('printing reveals the complete data behind tabs and filters',async({page})=>{
  await page.goto('/components/tabs/');
  await page.emulateMedia({media:'print'});
  await expect(page.locator('#sample-html')).toBeVisible();
  await expect(page.locator('#sample-css')).toBeVisible();
  await expect(page.locator('.tablist')).toBeHidden();
  await page.goto('/components/facets/');
  await page.emulateMedia({media:'screen'});
  await page.locator('[data-dd-facet="kind:insert"]').click();
  await page.emulateMedia({media:'print'});
  await expect(page.locator('#facet-items .row:visible')).toHaveCount(3);
});


test('the paper cover leads into the component documentation', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('.sheet > main.sheet-body')).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('link', {name:'Explore components', exact:true}).click();
  await expect(page).toHaveURL(/components\/index.html$/);
  await expect(page.locator('.doc .card-preview')).toHaveCount(components.length);
});

test('figure, caption and annotation preserve their reading order at narrow widths', async ({page}, testInfo) => {
  await page.goto('/');
  const figure = page.locator('#reading-paths');
  const summary = figure.locator('.plate-summary');
  /* `.sidenote`, not `.margin-note`. The two were one idea under two names —
     a note in the rail and a note in a caption — and the system collapsed them
     into the first. This test kept asking for the second, so it had been
     timing out on a locator that could never match rather than checking the
     reading order it is named for. */
  const note = figure.locator('.sidenote');
  const reference = page.locator('#path-reference');
  const paper = page.locator('#path-paper');
  await page.setViewportSize({width:1200,height:900});
  const desktopA = await reference.boundingBox(), desktopB = await paper.boundingBox();
  expect(desktopB.x).toBeGreaterThan(desktopA.x + desktopA.width);
  expect(Math.abs(desktopA.y - desktopB.y)).toBeLessThan(2);
  await figure.screenshot({path:testInfo.outputPath('figure-desktop.png')});
  for (const width of [768,390,320]) {
    await page.setViewportSize({width,height:900});
    const a = await reference.boundingBox(), b = await paper.boundingBox();
    expect(b.y).toBeGreaterThanOrEqual(a.y + a.height);
    const captionBox = await summary.boundingBox(), noteBox = await note.boundingBox();
    expect(noteBox.y).toBeGreaterThanOrEqual(captionBox.y + captionBox.height);
    expect(await figure.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    for (const name of await figure.locator('.flow-name').all()) {
      expect(await name.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      expect(await name.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
    }
  }
  await figure.screenshot({path:testInfo.outputPath('figure-mobile.png')});
  await page.emulateMedia({forcedColors:'active'});
  await expect(reference.locator('.ref-mark')).toHaveText('A');
  await expect(paper.locator('.ref-mark')).toHaveText('B');
  await page.emulateMedia({media:'print'});
  await expect(summary).toBeVisible();
  await expect(note).toBeVisible();
});
