import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generate } from './generate.mjs';
import { site } from '../src/site.mjs';
import { components } from '../src/components.mjs';
import { catalog } from '../src/catalog.mjs';
import { callers, statementLines, bins } from '../src/graph-examples.mjs';

const temp = mkdtempSync(join(tmpdir(), 'doc-site-check-'));
try {
  const pages = generate({outDir:temp});
  const titles = new Set();
  const descriptions = new Set();
  for (const page of pages) {
    const html = readFileSync(join(temp, page.path, 'index.html'), 'utf8');
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert(title && !titles.has(title), `Missing or duplicate title: ${page.path}`); titles.add(title);
    assert(description && !descriptions.has(description), `Missing or duplicate description: ${page.path}`); descriptions.add(description);
    assert.equal((html.match(/<h1\b/g)||[]).length, 1, `One h1: ${page.path}`);
    assert.match(html, /<html lang="en"/);
    assert(!/[ぁ-んァ-ン一-龯]/.test(html), `Untranslated content: ${page.path}`);
    assert(!/<style\b/.test(html), `Site-specific stylesheet: ${page.path}`);
    assert(!/<script[^>]+type="module"/.test(html), `Module runtime breaks file://: ${page.path}`);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(ids.length,new Set(ids).size, `Duplicate IDs: ${page.path}`);
    const canonical = new URL(page.path, site.url).href;
    assert(html.includes(`rel="canonical" href="${canonical}"`));
    assert(html.includes(`property="og:url" content="${canonical}"`));
    assert(html.includes(`property="og:title" content="${title}"`));
    for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(m[1]);
    if (page.path.startsWith('components/') && page.path !== 'components/') {
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
  const png = readFileSync(join(temp,'public/assets/og.png'));
  assert(png.subarray(1,4).equals(Buffer.from('PNG')));
  assert.equal(png.readUInt32BE(16),1200);
  assert.equal(png.readUInt32BE(20),630);
  console.log(`doc-site: ${pages.length} routes, unique SEO metadata, internal links, English content, highlighted examples and social assets verified.`);
} finally { rmSync(temp,{recursive:true,force:true}); }
