import { fileURLToPath } from 'node:url';
import uiPackage from '@k-kinzal/doc-ui/package.json' with { type: 'json' };
import { highlight } from './highlight.mjs';
import { locales, localePath, translate } from './i18n.mjs';
export const site = {
  name: 'doc-ui',
  url: 'https://k-kinzal.github.io/document-design/',
  repository: 'https://github.com/k-kinzal/document-design',
  title: 'doc-ui — Information, made clear.',
  description: 'A CSS design system for documentation and reports. Explore the components, layouts, and HTML for making information clear.',
};
export const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const releaseTag = `v${uiPackage.version}`;
export const cssURL = `${site.url}${releaseTag}/document-design.css`;
export const jsURL = `${site.url}${releaseTag}/document-design.js`;
export const stylesheet = `<link rel="stylesheet"\n      href="${cssURL}">`;

/*
 * The arrowhead, defined once per document.
 *
 * `.draw-arrow` sets `marker-end: url(#dd-arrow)`, and a marker reference that
 * resolves to nothing is not an error in SVG — the line just ends, with no
 * warning anywhere. So the block goes in the page shell rather than in each
 * figure: a page either has arrowheads or has no arrows at all, and never the
 * state in between.
 *
 * It is markup and not a component because the public API of this system is
 * the shape of the HTML. A generator emits these six lines once per page.
 */
export const drawDefs = `<svg class="draw-defs" aria-hidden="true" focusable="false">
<marker id="dd-arrow" markerUnits="userSpaceOnUse" viewBox="0 0 8 6" refX="8" refY="3"
        markerWidth="8" markerHeight="6" orient="auto-start-reverse">
  <path class="draw-arrowhead" d="M0 0L8 3L0 6Z"/>
</marker>
</svg>`;

export function code(source, id, language = 'HTML') {
  return `<div class="code-block"><div class="code-head"><span>${language}</span><button class="btn" data-dd-copy="#${id}" data-dd-enhance hidden aria-label="Copy ${language}" aria-live="polite">Copy</button></div><pre class="code" id="${id}"><code>${highlight(source, language)}</code></pre></div>`;
}
export function languageLink(path = '', lang = 'en') {
  const other = lang === 'en' ? 'ja' : 'en';
  const depth = localePath(path, lang).split('/').filter(Boolean).length;
  const base = depth ? '../'.repeat(depth) : './';
  return `<a class="btn btn-quiet" href="${base}${localePath(path, other)}index.html" lang="${other}" hreflang="${other}" rel="alternate" translate="no">${other === 'ja' ? '日本語' : 'English'}</a>`;
}
export function masthead(base = './', active = '', lang = 'en') {
  return `<header class="masthead"><a class="brand" href="${base}" aria-label="doc-ui home">doc-ui</a><span class="chip chip-ghost" translate="no">${releaseTag}</span><nav aria-label="Main navigation"><a href="${base}start/" ${active === 'start' ? 'aria-current="page"' : ''}>Get started</a><a href="${base}components/" ${active === 'components' ? 'aria-current="page"' : ''}>Components</a><a href="${site.repository}">GitHub <span aria-hidden="true">↗</span></a>${languageLink('', lang)}<button class="btn btn-quiet" data-dd-theme-toggle data-dd-enhance hidden aria-label="Switch color theme">◐</button></nav></header>`;
}
export function footer(base = './') {
  return `<footer class="colophon"><a class="brand" href="${base}">doc-ui</a><nav aria-label="Footer"><a href="${base}components/">Documentation</a><a href="${base}storybook/">Storybook ↗</a><a href="${site.repository}">GitHub ↗</a><span>by <a href="https://github.com/k-kinzal">k-kinzal</a> · MIT License</span></nav></footer>`;
}
export function document({ title, description, path = '', body, search = false, noindex = false, development = false, lang = 'en', route = path }) {
  const depth = path.split('/').filter(Boolean).length;
  const base = depth ? '../'.repeat(depth) : './';
  const url = new URL(path, site.url).href;
  const pageTitle = route || noindex ? `${title} — doc-ui` : translate(site.title, lang);
  const localeBase = new URL(localePath('', lang), site.url).href;
  const ld = [{ '@context': 'https://schema.org', '@type': route ? 'TechArticle' : 'WebPage', '@id': url, url, name: pageTitle, headline: title, description, inLanguage: lang, author: { '@type': 'Person', name: 'k-kinzal', url: 'https://github.com/k-kinzal' }, ...(route ? {} : { mainEntity: { '@type': 'SoftwareSourceCode', name: 'doc-ui', description: translate(site.description, lang), codeRepository: site.repository, programmingLanguage: ['CSS', 'HTML', 'JavaScript'], license: 'https://opensource.org/license/mit' } }) }];
  if (route && !noindex) ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'doc-ui', item: localeBase }, ...(route.startsWith('components/') && route !== 'components/' ? [{ '@type': 'ListItem', position: 2, name: translate('Components', lang), item: new URL('components/', localeBase).href }] : []), { '@type': 'ListItem', position: route.startsWith('components/') && route !== 'components/' ? 3 : 2, name: title, item: url }] });
  return `<!doctype html>
<html lang="${lang}" prefix="og: https://ogp.me/ns#">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(pageTitle)}</title>
<meta name="description" content="${escape(description)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#fcfcfe" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1f2023" media="(prefers-color-scheme: dark)">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
${noindex ? '' : `<link rel="canonical" href="${url}">\n${locales.map(language => `<link rel="alternate" hreflang="${language}" href="${new URL(localePath(route, language), site.url).href}">`).join('\n')}`}
<meta property="og:type" content="${route ? 'article' : 'website'}">
<meta property="og:site_name" content="doc-ui">
<meta property="og:locale" content="${lang === 'ja' ? 'ja_JP' : 'en_US'}">
<meta property="og:locale:alternate" content="${lang === 'ja' ? 'en_US' : 'ja_JP'}">
<meta property="og:title" content="${escape(pageTitle)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${url}">
${route ? '' : `<meta property="og:image" content="${site.url}assets/og.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="doc-ui — Information, made clear. A diagram compares the reading paths of a reference and a paper.">`}
<meta name="twitter:card" content="${route ? 'summary' : 'summary_large_image'}">
<meta name="twitter:title" content="${escape(pageTitle)}">
<meta name="twitter:description" content="${escape(description)}">
${route ? '' : `<meta name="twitter:image" content="${site.url}assets/og.png">
<meta name="twitter:image:alt" content="doc-ui — Information, made clear. A diagram compares the reading paths of a reference and a paper.">`}
<link rel="icon" href="${base}assets/favicon.png" type="image/png" sizes="48x48">
<link rel="apple-touch-icon" href="${base}assets/apple-touch-icon.png" sizes="180x180">
<link ${development ? '' : 'vite-ignore '}rel="stylesheet" href="${development ? '/@fs/' + fileURLToPath(import.meta.resolve('@k-kinzal/doc-ui/src/index.css')) : base + releaseTag + '/document-design.min.css'}">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
${search ? `<script vite-ignore src="${base}${localePath('assets/search.js', lang)}" defer></script>` : ''}
<script vite-ignore src="${development ? '/@fs/' + fileURLToPath(import.meta.resolve('@k-kinzal/doc-ui/src/js/document-design.js')) : base + releaseTag + '/document-design.js'}" defer></script>
</head>
<body>
<a class="skip" href="#main">${lang === 'ja' ? '本文へ移動' : 'Skip to content'}</a>
${drawDefs}
${body}
</body>
</html>\n`;
}
