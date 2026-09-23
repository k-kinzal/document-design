import { mkdirSync, rmSync, writeFileSync, cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { document, site } from '../src/site.mjs';
import { home } from '../src/home.mjs';
import { docs } from '../src/docs.mjs';
import { components } from '../src/components.mjs';
import { locales, localePath, localizeHTML, translate } from '../src/i18n.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const generatedRoot = resolve(root, '.generated');

export function generate({ development = false, outDir = generatedRoot } = {}) {
  const out = outDir;
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const assets = resolve(out, 'public');
  cpSync(resolve(root, 'public'), assets, { recursive: true });
  const ui = dirname(fileURLToPath(import.meta.resolve('@k-kinzal/doc-ui')));
  for (const version of ['v1', 'latest']) cpSync(ui, resolve(assets, version), { recursive: true });
  if (!existsSync(resolve(assets, 'assets/og.png'))) throw new Error('Missing social preview: public/assets/og.png');
  const pages = locales.flatMap(lang => [
    { path: '', title: site.title, description: site.description, body: home(lang) }, ...docs(lang),
  ].map(page => ({
    ...page, lang, route: page.path, path: localePath(page.path, lang),
    title: translate(page.title, lang), description: translate(page.description, lang),
    // Documentation links stay within the locale. Distribution and Storybook
    // belong to the repository root, shared by both languages.
    body: localizeHTML(page.body, { lang }).replace(/href="((?:\.\.?\/)+)(storybook|v1|latest)\//g,
      (_, base, shared) => `href="${lang === 'ja' ? '../' : ''}${base}${shared}/`),
  })));
  // Explicit index filenames also work in an archive opened over file://.
  const portable = html => html.replace(/(href|src)="((?:\.\.?\/)[^"?#]*\/|\.\.?\/)([?#][^"]*)?"/g, (_, attribute, path, query = '') => `${attribute}="${path}index.html${query}"`);
  for (const page of pages) {
    const target = resolve(out, page.path);
    mkdirSync(target, { recursive: true });
    writeFileSync(resolve(target, 'index.html'), document({ ...page, body: portable(page.body), development }));
  }
  for (const lang of locales) {
    const localeAssets = resolve(assets, localePath('', lang));
    mkdirSync(resolve(localeAssets, 'examples'), { recursive: true });
    mkdirSync(resolve(localeAssets, 'assets'), { recursive: true });
    const starter = localizeHTML(pages.find(p => p.starter && p.lang === lang).starter, { lang });
    writeFileSync(resolve(localeAssets, 'examples/report.html'), starter.replace('</head>', '<meta name="robots" content="noindex, follow">\n</head>'));
    writeFileSync(resolve(localeAssets, 'assets/search.js'), `(function () {\n  var root = new URL('../', document.currentScript.src);\n  window.ddSearchIndex = ${JSON.stringify(components.map(c => ({ name: translate(c.name, lang), where: translate(c.group, lang), body: `${translate(c.label, lang)} ${translate(c.description, lang)} ${c.name} ${c.label} ${c.api.map(a => a[0]).join(' ')}`, href: `components/${c.slug}/index.html` })))}.map(function (item) { item.href = new URL(item.href, root).href; return item; });\n})();\n`);
  }
  // A Pages error document may be served at any depth; its assets must be absolute.
  const missing = document({ title: 'Page not found', description: 'Explore the doc-ui components or return to the homepage.', noindex: true, body: `<main class="sheet" id="main"><p class="eyebrow">404 / NOT FOUND</p><h1>This page could not be found.</h1><p class="stand">The address may have changed, or there may be a typo in the link.</p><div class="actions"><a class="btn btn-primary btn-lg" href="${site.url}">Back to home</a><a href="${site.url}components/">Browse components →</a></div></main>` });
  writeFileSync(resolve(out, '404.html'), missing.replace('</main>', `<p class="stand" lang="ja">ページが見つかりません。<a href="${site.url}ja/">日本語のホームへ戻る</a></p></main>`).replaceAll('href="./', `href="${site.url}`).replaceAll('src="./', `src="${site.url}`).replace(/<meta (?:property="og:[^"]+"|name="twitter:[^"]+")[^>]+>\n/g, ''));
  writeFileSync(resolve(assets, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${pages.map(p => `<url><loc>${new URL(p.path, site.url).href}</loc>${locales.map(lang => `<xhtml:link rel="alternate" hreflang="${lang}" href="${new URL(localePath(p.route, lang), site.url).href}"/>`).join('')}</url>`).join('')}</urlset>\n`);
  writeFileSync(resolve(assets, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}sitemap.xml\n`);
  console.log(`doc-site: ${pages.length} static pages prepared for Vite+`);
  return pages;
}
