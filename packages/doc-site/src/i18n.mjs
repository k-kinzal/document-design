import { parse, parseFragment } from 'parse5';
import { highlight } from './highlight.mjs';
import messages from './locales/ja.json' with { type: 'json' };

export const locales = ['en', 'ja'];
export const localePath = (path, lang) => `${lang === 'ja' ? 'ja/' : ''}${path}`;
const normalize = value => value.replace(/\s+/g, ' ').trim();
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function translate(value, lang = 'ja') {
  if (lang !== 'ja') return value;
  const key = normalize(value);
  if (Object.hasOwn(messages, key)) return messages[key];
  const description = key.match(/^(.*?) Live examples, copyable HTML, classes, and usage guidance for the doc-ui (.*?) component\.$/);
  if (description) return `${translate(description[1])} ${description[2]}の実例、コピーできるHTML、クラス、使い方を紹介します。`;
  for (const separator of [' — ', ' / ']) {
    if (key.includes(separator)) return key.split(separator).map(part => translate(part)).join(separator);
  }
  return value;
}

const inline = new Set(['a', 'abbr', 'b', 'bdi', 'br', 'code', 'em', 'i', 'kbd', 'small', 'span', 'strong', 'sup', 'time']);
const blocks = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th', 'summary', 'figcaption', 'caption', 'label']);
const textOf = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(textOf).join('');
const onlyInline = node => (node.childNodes || []).every(child => child.nodeName === '#text' || (inline.has(child.tagName) && onlyInline(child)));

// Translate source ranges, not serialized trees: copyable examples retain their
// indentation, attributes, SVG geometry, identifiers, and real data verbatim.
// Inline markup stays inside sentence-sized messages so Japanese can reorder it.
export function localizeHTML(html, { lang = 'ja', collect } = {}) {
  if (lang === 'en' && !collect) return html;
  const tree = /^\s*<!doctype/i.test(html) ? parse(html, { sourceCodeLocationInfo: true }) : parseFragment(html, { sourceCodeLocationInfo: true });
  const edits = [];
  function message(value, start, end) {
    const key = normalize(value);
    if (!key) return;
    collect?.add(key);
    if (lang !== 'ja') return;
    const result = translate(key);
    if (result === key) return;
    edits.push([start, end, value.replace(value.trim(), () => result)]);
  }
  function walk(node) {
    const loc = node.sourceCodeLocation;
    if ((node.attrs || []).some(a => a.name === 'translate' && a.value === 'no')) return;
    for (const attr of node.attrs || []) {
      const range = loc?.attrs?.[attr.name];
      if (!range) continue;
      if (['aria-label', 'placeholder', 'title', 'alt', 'data-dd-hint'].includes(attr.name)) {
        collect?.add(normalize(attr.value));
        const result = translate(attr.value, lang);
        if (result !== attr.value) edits.push([range.startOffset, range.endOffset, `${attr.name}="${escape(result)}"`]);
      } else if (lang === 'ja' && attr.name === 'lang' && attr.value === 'en') {
        edits.push([range.startOffset, range.endOffset, 'lang="ja"']);
      }
    }
    if (node.tagName === 'script' || node.tagName === 'style') return;
    if (node.tagName === 'code' && node.parentNode?.tagName !== 'pre') return;
    if (node.tagName === 'pre') {
      const code = node.childNodes?.find(c => c.tagName === 'code');
      const source = textOf(code || node);
      if (source.trimStart().startsWith('<')) {
        const translated = localizeHTML(source, { lang, collect });
        const range = (code || node).sourceCodeLocation;
        edits.push([range.startTag.endOffset, range.endTag.startOffset, highlight(translated, 'HTML')]);
      } else {
        // Code stays literal; a hole describes what is missing, not SQL syntax.
        function holes(child) {
          if (child.attrs?.some(a => a.name === 'class' && a.value.split(/\s+/).includes('hole'))) walk(child);
          else for (const next of child.childNodes || []) holes(next);
        }
        for (const child of node.childNodes || []) holes(child);
      }
      return;
    }
    if (blocks.has(node.tagName) && onlyInline(node) && loc?.endTag) {
      const start = loc.startTag.endOffset, end = loc.endTag.startOffset;
      const content = html.slice(start, end);
      // A linked component name or a technical token is translated at its leaf;
      // a sentence with inline markup remains a single translation unit.
      const direct = (node.childNodes || []).filter(c => c.nodeName === '#text').map(textOf).join('').trim();
      if (/\s/.test(direct) && /[a-zA-Z]/.test(direct)) {
        message(content, start, end);
        return;
      }
    }
    if (node.nodeName === '#text' && loc && node.value.trim()) message(html.slice(loc.startOffset, loc.endOffset), loc.startOffset, loc.endOffset);
    else for (const child of node.childNodes || []) walk(child);
  }
  walk(tree);
  for (const [start, end, value] of edits.sort((a, b) => b[0] - a[0])) html = html.slice(0, start) + value + html.slice(end);
  return html;
}
