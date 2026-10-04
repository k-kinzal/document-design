import MarkdownIt from 'markdown-it';
import { relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defaults } from './options.mjs';

const escape = text => String(text).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

function plainText(tokens) {
  return tokens.map(token => token.children ? plainText(token.children)
    : ['text', 'code_inline'].includes(token.type) ? token.content
      : ['softbreak', 'hardbreak'].includes(token.type) ? ' ' : '').join('');
}

// Rebase only authored relative URLs. Fragments, absolute paths and remote
// resources retain their meaning; no resource is fetched during conversion.
function rebase(url, sourceDir, outputDir) {
  if (!sourceDir || !outputDir || !url || /^(?:[a-z][a-z\d+.-]*:|[/#?])/i.test(url)) return url;
  const target = new URL(url, pathToFileURL(sourceDir + sep));
  const path = relative(outputDir, fileURLToPath(target)).split(sep).map(encodeURIComponent).join('/');
  return (path || './') + target.search + target.hash;
}

function prepare(tokens, options) {
  const used = new Set();
  const visit = list => {
    for (let i = 0; i < list.length; i++) {
      const token = list[i];
      if (token.type === 'heading_open') {
        const name = plainText(list[i + 1].children ?? []).toLowerCase()
          .replace(/[^\p{L}\p{N}\p{M}_\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
        let id = name;
        for (let suffix = 1; used.has(id); suffix++) id = `${name}-${suffix}`;
        used.add(id);
        token.attrSet('id', id);
      }
      for (const attr of ['href', 'src']) {
        const url = token.attrGet(attr);
        if (url !== null) token.attrSet(attr, rebase(url, options.sourceDir, options.outputDir));
      }
      // A disabled checkbox is readable with no behaviour script. Keep the
      // inline children intact so links and emphasis in a task remain Markdown.
      if (token.type === 'inline' && list[i - 1]?.type === 'paragraph_open' &&
          list[i - 2]?.type === 'list_item_open' && token.children?.[0]?.type === 'text') {
        const match = token.children[0].content.match(/^\[([ xX])\][ \t]+/);
        if (match) {
          token.children[0].content = token.children[0].content.slice(match[0].length);
          const checkbox = new token.constructor('html_inline', '', 0);
          checkbox.content = `<input type="checkbox" disabled${match[1] === ' ' ? '' : ' checked'} aria-label="${escape(plainText(token.children))}"> `;
          token.children.unshift(checkbox);
        }
      }
      if (token.children) visit(token.children);
    }
  };
  visit(tokens);
}

function composition(tokens, md, options, env) {
  const render = items => md.renderer.render(items, md.options, env);
  const prose = items => items.length ? `<div class="prose">\n${render(items)}</div>\n` : '';
  if (options.layout === 'doc') {
    return `<div class="doc"><div class="main"><main class="content"><article class="prose">\n${render(tokens)}</article></main></div></div>`;
  }
  const title = tokens[0]?.type === 'heading_open' && tokens[0].tag === 'h1' ? tokens.slice(0, 3) : [];
  const body = tokens.slice(title.length);
  if (options.layout === 'paper') {
    return `<main class="sheet sheet-paper">\n${title.length ? `<section class="paper-head">${render(title)}</section>\n` : ''}<section class="prose">\n${render(body)}</section></main>`;
  }
  // Only top-level H2s divide the document. A heading in a quote or list is
  // still part of that block, and must not leave its closing tags behind.
  const groups = [[]];
  for (const token of body) {
    if (token.type === 'heading_open' && token.tag === 'h2' && token.level === 0) groups.push([]);
    groups.at(-1).push(token);
  }
  const [intro, ...sections] = groups;
  if (options.layout === 'book') {
    const opening = title.length || intro.length
      ? `<section class="book-page${title.length ? ' book-cover' : ''}">\n${title.length ? `<header class="paper-head">${render(title)}</header>\n` : ''}${prose(intro)}</section>\n` : '';
    return `<main class="sheet sheet-paper sheet-book">\n${opening}${sections.map(section =>
      `<section class="book-page"><header class="paper-head">${render(section.slice(0, 3))}</header>\n${prose(section.slice(3))}</section>\n`).join('')}</main>`;
  }
  return `<main class="sheet">\n${render(title)}${prose(intro)}${sections.map((section, index) => {
    section[0].attrJoin('class', 'lead');
    return `<section class="sec"><div class="rail"><div class="label" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div></div><div class="field">\n${render(section.slice(0, 3))}${prose(section.slice(3))}</div></section>\n`;
  }).join('')}</main>`;
}

export function renderMarkdown(markdown, settings = {}) {
  const options = { ...defaults, ...settings };
  const md = new MarkdownIt({ html: options.html, linkify: true });
  const tableLabel = options.lang.toLowerCase().startsWith('ja') ? '表（横スクロール）' : 'Table (scroll horizontally)';
  md.renderer.rules.table_open = () => `<div class="table-wrap" role="region" tabindex="0" aria-label="${tableLabel}"><table>\n`;
  md.renderer.rules.table_close = () => '</table></div>\n';
  const env = {};
  const tokens = md.parse(markdown, env);
  prepare(tokens, options);
  const h1 = tokens.findIndex(token => token.type === 'heading_open' && token.tag === 'h1');
  const title = options.title ?? (h1 < 0 ? options.fallbackTitle ?? 'Document' : plainText(tokens[h1 + 1].children ?? []));
  const attrs = [`lang="${escape(options.lang)}"`, `data-dd-color="${escape(options.color)}"`];
  if (options.theme !== 'auto') attrs.push(`data-dd-theme="${escape(options.theme)}"`);
  if (options.paper !== 'auto') attrs.push(`data-dd-paper="${escape(options.paper)}"`);
  if (options['print-urls'] !== 'inline') attrs.push(`data-dd-print-urls="${escape(options['print-urls'])}"`);
  return `<!doctype html>
<html ${attrs.join(' ')}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<style>${(options.css ?? '').replace(/<\/style/gi, '<\\/style')}</style>
</head>
<body>
${composition(tokens, md, options, env)}
</body>
</html>
`;
}
