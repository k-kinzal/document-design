import { createHighlighter } from 'shiki';

// Shiki parses the language at build time. Only doc-ui's existing token classes
// reach the browser, so syntax follows the palette in both themes and on paper.
const kinds = {
  kw: ['keyword', 'storage', 'entity.name.tag', 'support.type'],
  str: ['string'],
  num: ['constant.numeric', 'constant.language'],
  com: ['comment'],
  var: ['variable', 'entity.other.attribute-name', 'support.type.property-name'],
  id: ['entity.name.function', 'support.function'],
};
const highlighter = await createHighlighter({
  langs: ['html', 'css', 'javascript', 'sql', 'php', 'bash'],
  themes: [{ name: 'doc-ui', fg: 'var(--dd-syn-id)', bg: 'var(--dd-surface)', settings: Object.entries(kinds).map(([kind, scope]) => ({ scope, settings: { foreground: `var(--dd-syn-${kind})` } })) }],
});
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export function highlight(source, language = 'HTML') {
  const { tokens } = highlighter.codeToTokens(source, { lang: language.toLowerCase(), theme: 'doc-ui' });
  return tokens.map(line => line.map(token => {
    const kind = token.color?.match(/^var\(--dd-syn-(\w+)\)$/)?.[1] || 'id';
    return `<span class="tok-${kind}">${escape(token.content)}</span>`;
  }).join('')).join('\n');
}
