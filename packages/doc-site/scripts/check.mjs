import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generate } from './generate.mjs';
import { site } from '../src/site.mjs';
import { components } from '../src/components.mjs';
import { catalog } from '../src/catalog.mjs';
import { callers, statementLines, bins } from '../src/graph-examples.mjs';
import { locales, localePath, localizeHTML, translate } from '../src/i18n.mjs';
import sharedMessages from '../src/locales/shared.json' with { type: 'json' };
import { parseFragment } from 'parse5';

const temp = mkdtempSync(join(tmpdir(), 'doc-site-check-'));
try {
  const pages = generate({outDir:temp});
  assert.equal(pages.length, (components.length + 3) * locales.length);
  const titles = new Set();
  const descriptions = new Set();
  const untranslated = new Set();
  const shared = new Set(sharedMessages);
  for (const page of pages) {
    const html = readFileSync(join(temp, page.path, 'index.html'), 'utf8');
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert(title && !titles.has(title), `Missing or duplicate title: ${page.path}`); titles.add(title);
    assert(description && !descriptions.has(description), `Missing or duplicate description: ${page.path}`); descriptions.add(description);
    assert.equal((html.match(/<h1\b/g)||[]).length, 1, `One h1: ${page.path}`);
    assert(html.includes(`<html lang="${page.lang}"`));
    if (page.lang === 'en') assert(!/[ぁ-んァ-ン一-龯]/.test(html.replace(/<a\b[^>]*translate="no"[^>]*>.*?<\/a>/gs, '')), `Unexpected Japanese content: ${page.path}`);
    else assert(/[ぁ-んァ-ン一-龯]/.test(description), `Missing Japanese description: ${page.path}`);
    if (page.lang === 'en') {
      const messages = new Set([page.title, page.description]);
      localizeHTML(page.body, { lang: 'en', collect: messages });
      for (const message of messages) {
        if (/[a-zA-Z]/.test(message) && translate(message) === message && !shared.has(message)) untranslated.add(message);
      }
    }
    for (const lang of locales) assert(html.includes(`hreflang="${lang}" href="${new URL(localePath(page.route, lang), site.url).href}"`));
    const other = page.lang === 'en' ? 'ja' : 'en';
    assert(html.includes(`lang="${other}" hreflang="${other}" rel="alternate" translate="no"`), `Missing language switch: ${page.path}`);
    assert(!/<style\b/.test(html), `Site-specific stylesheet: ${page.path}`);
    assert(!/<script[^>]+type="module"/.test(html), `Module runtime breaks file://: ${page.path}`);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(ids.length,new Set(ids).size, `Duplicate IDs: ${page.path}`);
    const canonical = new URL(page.path, site.url).href;
    assert(html.includes(`rel="canonical" href="${canonical}"`));
    assert(html.includes(`property="og:url" content="${canonical}"`));
    assert(html.includes(`property="og:title" content="${title}"`));
    for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(m[1]);
    if (page.route.startsWith('components/') && page.route !== 'components/') {
      assert(!/property="og:image"/.test(html), 'Detail pages must not inherit an unrelated site image');
      assert.match(html, /class="tok-kw"/, `Unhighlighted code: ${page.path}`);
    }
    for (const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|data:|mailto:)/.test(url)) continue;
      const parsed = new URL(url.replaceAll('&amp;','&'), `https://local/${page.path}`);
      // Storybook is another package's artifact. Its integration is checked
      // only after the root assembles all packages into pages/.
      if(parsed.pathname.startsWith('/storybook/')) continue;
      let file = decodeURIComponent(parsed.pathname).slice(1);
      if(file.endsWith('/') || !file) file += 'index.html';
      const target = [join(temp,file),join(temp,'public',file)].find(existsSync);
      assert(target,`Broken local URL in ${page.path}: ${url}`);
      if(parsed.hash && file.endsWith('.html')) assert(readFileSync(target,'utf8').includes(`id="${decodeURIComponent(parsed.hash.slice(1))}"`),`Missing anchor: ${url}`);
    }
  }
  assert.deepEqual([...untranslated], [], 'Add Japanese translations (or document intentional literals in locales/shared.json)');
  // The source shown for copying must produce the same translated specimen.
  // Comparing decoded code catches accidental changes to quoting, indentation,
  // SVG coordinates, and identifiers in the build-time HTML transformation.
  const textOf = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(textOf).join('');
  for (const c of components) {
    const html = readFileSync(join(temp, 'ja/components', c.slug, 'index.html'), 'utf8');
    const sources = new Map();
    function visit(node) {
      const id = node.attrs?.find(a => a.name === 'id')?.value;
      if (node.tagName === 'pre' && id?.startsWith('source-')) sources.set(id, textOf(node));
      for (const child of node.childNodes || []) visit(child);
    }
    visit(parseFragment(html));
    c.examples.forEach((example, i) => assert.equal(sources.get(`source-${i}`),
      example.language && example.language !== 'HTML' ? example.html : localizeHTML(example.html), `${c.slug} example ${i}: copy source differs`));
  }
  // The two reading modes describe the same snapshot, with no lost records.
  assert.equal(catalog.resolution.reduce((n,r)=>n+r.count,0),catalog.total);
  assert.equal(catalog.callers.reduce((n,c)=>n+c.statements,0),catalog.statements);
  assert.deepEqual(callers, catalog.callers.map(c => [c.method,c.statements]));
  assert.equal(statementLines.length,catalog.statements);
  assert.equal(new Set(statementLines).size,statementLines.length);
  assert.deepEqual(statementLines,[...statementLines].sort((a,b)=>a-b));
  assert.equal(bins.reduce((n,b)=>n+b.count,0),catalog.callers.length);
  // Every documented example is intentionally real HTML, not a screenshot.
  assert.equal(new Set(components.map(c=>c.slug)).size,components.length);
  for (const lang of locales) {
    const starter = readFileSync(join(temp, 'public', localePath('examples/report.html', lang)), 'utf8');
    assert(starter.includes(`<html lang="${lang}"`));
    const search = readFileSync(join(temp, 'public', localePath('assets/search.js', lang)), 'utf8');
    assert(search.includes(translate('Reading text', lang)));
  }
  const png = readFileSync(join(temp,'public/assets/og.png'));
  assert(png.subarray(1,4).equals(Buffer.from('PNG')));
  assert.equal(png.readUInt32BE(16),1200);
  assert.equal(png.readUInt32BE(20),630);
  console.log(`doc-site: ${pages.length} bilingual routes, locale metadata, internal links, search indexes, highlighted examples and social assets verified.`);
} finally { rmSync(temp,{recursive:true,force:true}); }
