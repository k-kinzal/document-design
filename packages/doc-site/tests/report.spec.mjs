import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

const text = {
  en: 'The catalog contains 844 statements and 978 findings. The unresolved findings remain visible alongside the limits of the analysis.',
  ja: 'カタログには844件の文と978件の指摘がある。未解決の指摘を隠さず、解析の範囲と残る限界を本文に記録する。',
};

async function report(page, markup, lang = 'en') {
  await page.goto('/components/report/');
  await page.evaluate(({ markup, lang }) => {
    document.documentElement.lang = lang;
    document.body.innerHTML = markup;
  }, { markup, lang });
}

for (const lang of ['en', 'ja']) for (const wrapper of ['', 'sheet-body']) for (const media of ['screen', 'print']) {
  test(`report section children use the reading column: ${lang}, ${wrapper || 'direct'}, ${media}`, async ({ page }) => {
    await page.emulateMedia({ media });
    const section = `<section class="sec">
      <div class="rail"><h2 class="label">01 / Evidence</h2><p class="sidenote">${text[lang]}</p></div>
      <div class="field"><p class="lead">${text[lang]}</p></div>
      <p class="note">${text[lang]}</p>
      <div class="prose"><p>${text[lang]}</p></div>
      <div class="compare"><div><p>${text[lang]}</p></div><div><p>${text[lang]}</p></div></div>
      <div class="table-wrap"><table><tbody><tr><th>Statements</th><td>844</td></tr></tbody></table></div>
      <figure class="plate plate-wide"><figcaption>${text[lang]}</figcaption></figure>
      <figure class="plate plate-full"><figcaption>${text[lang]}</figcaption></figure>
      <p class="caveat">${text[lang]}</p>
    </section>`;
    await report(page, `<article class="sheet" lang="${lang}">${wrapper ? `<div class="${wrapper}">${section}</div>` : section}</article>`, lang);
    for (const width of [1440, 1024, 900, 768, 720, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const m = await page.locator('.sec').evaluate(sec => {
        const box = e => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, right: b.right, bottom: b.bottom }; };
        return {
          section: box(sec), field: box(sec.querySelector('.field')),
          content: [...sec.children].filter(e => !e.matches('.rail,.field,.plate-full')).map(box),
          full: box(sec.querySelector('.plate-full')),
          rail: getComputedStyle(sec.querySelector('.rail')).display,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
      expect(m.overflow, `${width}px`).toBe(false);
      for (const b of m.content) {
        expect(b.x, `${width}px: content starts at the field`).toBeCloseTo(m.field.x, 0);
        expect(b.width).toBeGreaterThanOrEqual(Math.min(280, m.field.width));
        expect(b.right).toBeLessThanOrEqual(m.section.right + 1);
      }
      expect(m.full.x).toBeCloseTo(m.section.x, 0);
      expect(m.full.width).toBeCloseTo(m.section.width, 0);
      if (m.rail === 'contents') expect(m.field.x).toBeCloseTo(m.section.x, 0);
    }
  });
}

for (const placement of ['section', 'field', 'inset']) {
  test(`report arrangements retain readable tracks: ${placement}`, async ({ page }) => {
    const arrangements = `<div class="figures">${['Statements', 'Findings', 'Dynamic SQL findings', 'Limits'].map((label, i) => `<figure><h3>${label}</h3><p>${i === 0 ? text.en.repeat(4) : text.en}</p></figure>`).join('')}</div>
      <div class="stats"><div class="stat"><b class="stat-fig">844</b><p class="stat-label">Statements</p></div><a class="stat" href="#"><b class="stat-fig">978</b><p class="stat-label">Findings</p></a><div class="stat"><b class="stat-fig">709</b><p class="stat-label">Dynamic SQL findings</p></div></div>`;
    await report(page, placement === 'inset'
      ? `<article class="sheet sheet-inset">${arrangements}</article>`
      : `<article class="sheet"><section class="sec"><div class="label">01 / Evidence</div>${placement === 'field' ? `<div class="field">${arrangements}</div>` : arrangements}</section></article>`);
    for (const width of [1440, 900, 768, 720, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const m = await page.evaluate(() => [...document.querySelectorAll('.figures,.stats')].map(group => {
        const p = group.getBoundingClientRect();
        return { width: p.width, children: [...group.children].map(e => {
          const b = e.getBoundingClientRect();
          return { x: b.x - p.x, y: b.y - p.y, width: b.width, right: b.right - p.x, bottom: b.bottom - p.y };
        }) };
      }));
      for (const group of m) {
        expect(Math.max(...group.children.map(b => b.width)) - Math.min(...group.children.map(b => b.width)), `${width}px: equal tracks`).toBeLessThan(1);
        for (const b of group.children) {
          expect(b.x).toBeGreaterThanOrEqual(-1);
          expect(b.right).toBeLessThanOrEqual(group.width + 1);
          expect(b.width).toBeGreaterThanOrEqual(Math.min(150, group.width));
        }
        for (let i = 1; i < group.children.length; i++) {
          const a = group.children[i - 1], b = group.children[i];
          expect(b.y >= a.bottom - 1 || (Math.abs(b.y - a.y) < 1 && b.x >= a.right - 1), `${width}px: source order`).toBe(true);
        }
        if (width === 1440) {
          expect(group.children[1].y).toBeCloseTo(group.children[0].y, 0);
          expect(group.children[1].x).toBeGreaterThan(group.children[0].x);
        }
      }
    }
  });
}

for (const width of [390, 320]) test(`embedded report responds to its own width: ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await report(page, `<div style="width: ${width}px"><article class="sheet"><section class="sec"><div class="rail"><h2 class="label">01 / Evidence</h2><p class="sidenote">${text.en}</p></div><div class="field"><p class="lead">${text.en}</p></div><p class="note">${text.en}</p><div class="figures"><figure><h3>Statements</h3><p>${text.en}</p></figure><figure><h3>Findings</h3><p>${text.en}</p></figure></div></section></article></div>`);
  const widths = await page.locator('.field,.sec > .note,.figures > figure').evaluateAll(es => es.map(e => e.getBoundingClientRect().width));
  for (const actual of widths) expect(actual).toBeGreaterThanOrEqual(Math.min(280, width - 48));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const wrapper of ['', 'sheet-body']) {
  test(`inset report keeps sections and hero in their frames: ${wrapper || 'direct'}`, async ({ page }) => {
    const body = `<h1>Keep the missing sources visible</h1><div class="hero"><div class="was"><span class="cap">Before</span><span class="fig">68.97</span><span class="unit">Source coverage</span></div><div class="now"><span class="cap">After</span><span class="fig">96.67</span><span class="unit">Source coverage</span></div></div><section class="sec"><h2 class="label">01 / Sources</h2><div class="field"><p class="lead">${text.en}</p></div><p class="note">${text.en}</p></section>`;
    await report(page, `<article class="sheet sheet-inset">${wrapper ? `<div class="${wrapper}">${body}</div>` : body}</article>`);
    for (const width of [1128, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      if (width <= 390) await page.locator('.sheet').evaluate(el => { el.style.width = '200px'; });
      const m = await page.evaluate(() => {
        const box = e => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, right: b.right, bottom: b.bottom }; };
        const hero = document.querySelector('.hero'), sec = document.querySelector('.sec');
        return { hero: box(hero), sides: [...hero.children].map(box), field: box(sec.querySelector('.field')), note: box(sec.querySelector('.note')), overflow: document.documentElement.scrollWidth > innerWidth + 1 };
      });
      expect(m.overflow).toBe(false);
      expect(m.note.x).toBeCloseTo(m.field.x, 0);
      for (const b of m.sides) {
        expect(b.x).toBeGreaterThanOrEqual(m.hero.x - 1);
        expect(b.right).toBeLessThanOrEqual(m.hero.right + 1);
        expect(b.width).toBeGreaterThanOrEqual(Math.min(150, m.hero.width));
        if (width <= 768) expect(b.width).toBeCloseTo(m.hero.width, 0);
      }
      if (width <= 768) expect(m.sides[1].y).toBeGreaterThanOrEqual(m.sides[0].bottom);
    }
  });
}

test('standalone arrangements still fold without a size container', async ({ page }) => {
  await report(page, `<div class="split"><p>${text.en}</p><p>${text.en}</p></div><div class="figures"><figure><h3>Statements</h3><p>${text.en}</p></figure><figure><h3>Findings</h3><p>${text.en}</p></figure></div>`);
  await page.setViewportSize({ width: 320, height: 1000 });
  const widths = await page.locator('.split > *,.figures > *').evaluateAll(es => es.map(e => e.getBoundingClientRect().width));
  for (const width of widths) expect(width).toBe(320);
});
