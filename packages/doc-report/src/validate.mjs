// The last gate before upload: the finished document is parsed and every
// element, attribute and URL is checked against an allowlist. The renderer
// is trusted code, but a report is uploaded and opened by people; a parser
// that says "nothing here can execute or fetch" is worth more than the
// renderer's intentions. Regular expressions are not the sanitizer here;
// they only inspect the two places CSS can hide a reference.
import { parse } from 'parse5';

const HTML_TAGS = new Set(['html', 'head', 'body', 'meta', 'title', 'style', 'a', 'abbr', 'article', 'aside', 'b', 'bdi', 'blockquote', 'br', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'i', 'ins', 'kbd', 'li', 'main', 'mark', 'nav', 'ol', 'p', 'pre', 'q', 's', 'samp', 'section', 'small', 'span', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'time', 'tr', 'u', 'ul', 'var', 'wbr']);
const SVG_TAGS = new Set(['svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'marker', 'defs', 'title', 'desc']);
const SVG_NS = 'http://www.w3.org/2000/svg';

const GLOBAL_ATTRS = new Set(['class', 'id', 'lang', 'dir', 'title', 'role', 'translate', 'hidden']);
const HTML_ATTRS = {
  a: new Set(['href', 'rel', 'hreflang']),
  meta: new Set(['charset', 'name', 'content', 'http-equiv']),
  html: new Set([]),
  time: new Set(['datetime']),
  td: new Set(['colspan', 'rowspan', 'headers']),
  th: new Set(['colspan', 'rowspan', 'scope', 'abbr']),
  ol: new Set(['start', 'reversed', 'type']),
  li: new Set(['value']),
  details: new Set(['open']),
  col: new Set(['span']),
  colgroup: new Set(['span']),
  abbr: new Set([]),
};
const SVG_ATTRS = new Set(['viewBox', 'xmlns', 'width', 'height', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry', 'd', 'x1', 'y1', 'x2', 'y2', 'points', 'transform', 'text-anchor', 'dominant-baseline', 'refX', 'refY', 'markerWidth', 'markerHeight', 'markerUnits', 'orient', 'focusable', 'preserveAspectRatio', 'fill', 'dx', 'dy', 'aria-hidden', 'aria-label', 'aria-labelledby']);
const ALLOWED_META = new Set(['viewport', 'color-scheme', 'generator', 'robots', 'description']);

// Inline styles the doc-ui components read as custom properties. Nothing
// else is allowed in a style attribute.
const STYLE_DECL = /^\s*(--dd-part\s*:\s*\d{1,3}(?:\.\d+)?%|--dd-draw-width\s*:\s*\d{1,5}px|--dd-flow-steps\s*:\s*\d{1,2})\s*$/;

export function validateHtml(html) {
  const problems = [];
  const document = parse(html);
  let styleCount = 0;
  let htmlLang = null;
  let charset = false;
  let title = false;

  const problem = (node, message) => {
    const where = node.sourceCodeLocation ? `line ${node.sourceCodeLocation.startLine}` : node.nodeName;
    problems.push(`${message} (${where})`);
  };

  const attrsOf = (node) => Object.fromEntries((node.attrs ?? []).map((a) => [a.name, a.value]));

  function checkUrl(node, value) {
    const v = value.trim();
    if (v.startsWith('#')) return;
    let url;
    try { url = new URL(v); } catch { problem(node, `href is not an absolute https URL or fragment: ${JSON.stringify(v.slice(0, 80))}`); return; }
    if (url.protocol !== 'https:') problem(node, `href uses ${url.protocol}, only https: is allowed`);
  }

  function checkStyleText(node, text) {
    // `behavior:` is the IE binding property; `scroll-behavior` and
    // `overscroll-behavior` are ordinary and appear in the stylesheet.
    if (/@import|expression\s*\(|(?:^|[^-\w])behavior\s*:|-moz-binding|javascript:|<\/style/i.test(text)) problem(node, 'stylesheet contains a forbidden construct');
    for (const m of text.matchAll(/url\s*\(\s*(['"]?)([^'")]*)\1\s*\)/gi)) {
      if (!m[2].trim().startsWith('#')) problem(node, `stylesheet references an external resource: url(${m[2].slice(0, 60)})`);
    }
  }

  function walk(node, inSvg) {
    if (node.nodeName === '#comment') return;
    if (node.nodeName === '#text' || node.nodeName === '#documentType' || node.nodeName === '#document') {
      for (const child of node.childNodes ?? []) walk(child, inSvg);
      return;
    }
    const tag = node.tagName;
    const svg = inSvg || node.namespaceURI === SVG_NS;
    const attrs = attrsOf(node);
    if (svg) {
      if (!SVG_TAGS.has(tag)) { problem(node, `SVG element <${tag}> is not allowed`); return; }
    } else if (!HTML_TAGS.has(tag)) { problem(node, `element <${tag}> is not allowed`); return; }

    for (const [name, value] of Object.entries(attrs)) {
      if (/^on/i.test(name)) { problem(node, `event handler attribute ${name}`); continue; }
      if (name.startsWith('aria-') || name.startsWith('data-dd-')) continue;
      if (name === 'style') {
        for (const decl of value.split(';').filter((d) => d.trim())) if (!STYLE_DECL.test(decl)) problem(node, `style attribute declaration not allowed: ${decl.trim().slice(0, 60)}`);
        continue;
      }
      if (svg) {
        if (name.includes(':') && name !== 'xlink:href') continue; // xmlns:* are harmless namespace declarations
        if (name === 'href' || name === 'xlink:href') { problem(node, `${name} on SVG <${tag}>`); continue; }
        if (!SVG_ATTRS.has(name) && !GLOBAL_ATTRS.has(name)) problem(node, `attribute ${name} on <${tag}> is not allowed`);
        if (name === 'fill' && value.trim() !== 'none') problem(node, 'fill must be "none" or come from a class');
        continue;
      }
      if (GLOBAL_ATTRS.has(name) || HTML_ATTRS[tag]?.has(name)) {
        if (name === 'href') checkUrl(node, value);
        continue;
      }
      problem(node, `attribute ${name} on <${tag}> is not allowed`);
    }

    if (!svg) {
      if (tag === 'meta') {
        if (attrs.charset !== undefined) { if (attrs.charset.toLowerCase() !== 'utf-8') problem(node, 'charset must be utf-8'); charset = true; }
        else if (attrs['http-equiv'] !== undefined) { if (attrs['http-equiv'].toLowerCase() !== 'content-security-policy') problem(node, `meta http-equiv=${attrs['http-equiv']} is not allowed`); }
        else if (!ALLOWED_META.has(attrs.name ?? '')) problem(node, `meta name=${attrs.name} is not allowed`);
      }
      if (tag === 'style') {
        styleCount++;
        checkStyleText(node, (node.childNodes ?? []).map((c) => c.value ?? '').join(''));
      }
      if (tag === 'html') htmlLang = attrs.lang ?? null;
      if (tag === 'title') title = true;
      if (tag === 'a' && attrs.href === undefined) problem(node, '<a> without href');
    }
    for (const child of node.childNodes ?? []) walk(child, svg);
  }
  walk(document, false);

  if (!htmlLang || !/^[a-z]{2}(?:-[A-Za-z0-9]+)?$/.test(htmlLang)) problems.push('<html> needs a lang attribute');
  if (!charset) problems.push('missing <meta charset="utf-8">');
  if (!title) problems.push('missing <title>');
  if (styleCount !== 1) problems.push(`expected exactly one <style>, found ${styleCount}`);
  if (/<script/i.test(html) && problems.every((p) => !p.includes('<script>'))) problems.push('script tag text present');
  return { ok: problems.length === 0, problems };
}
