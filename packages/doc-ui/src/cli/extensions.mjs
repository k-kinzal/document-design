import footnote from 'markdown-it-footnote';
import deflist from 'markdown-it-deflist';
import { tex } from '@mdit/plugin-tex';
import { renderToString } from 'katex';

const alerts = {
  NOTE: ['Note', '補足', 'tone-blue'],
  TIP: ['Tip', 'ヒント', 'tone-green'],
  IMPORTANT: ['Important', '重要', 'tone-violet'],
  WARNING: ['Warning', '警告', 'tone-warn'],
  CAUTION: ['Caution', '注意', 'tone-warn'],
};

export function extensions(md, { lang }) {
  const ja = lang.toLowerCase().startsWith('ja');
  const escape = md.utils.escapeHtml;
  md.use(deflist).use(footnote).use(tex, {
    delimiters: 'all', mathFence: true,
    render(source, displayMode) {
      // Native MathML needs neither KaTeX CSS nor downloadable fonts.
      const markup = renderToString(source, {
        output: 'mathml', displayMode, trust: false, throwOnError: true,
        strict: 'ignore', maxExpand: 1000, maxSize: 20,
      });
      const math = markup.match(/<math\b[\s\S]*<\/math>/)?.[0];
      if (!math) throw new Error('The equation renderer did not produce MathML.');
      return displayMode
        ? `<div class="equation"><div class="eq-body" tabindex="0" role="region" aria-label="${ja ? '数式' : 'Equation'}">${math}</div></div>\n`
        : math;
    },
  });

  // Footnote references use the same visual vocabulary as source citations.
  // Reserve their IDs before assigning heading IDs in the document renderer.
  const anchor = meta => `dd-fn-${meta.id + 1}`;
  const reference = meta => `dd-fnref-${meta.id + 1}${meta.subId ? `-${meta.subId}` : ''}`;
  md.renderer.rules.footnote_ref = (tokens, i) => {
    const meta = tokens[i].meta;
    return `<a class="cite" role="doc-noteref" href="#${anchor(meta)}" id="${reference(meta)}" aria-label="${ja ? '脚注' : 'Footnote'} ${meta.id + 1}">${meta.id + 1}</a>`;
  };
  md.renderer.rules.footnote_block_open = () => `<section role="doc-endnotes" aria-label="${ja ? '脚注' : 'Footnotes'}"><ol class="sources">\n`;
  md.renderer.rules.footnote_block_close = () => '</ol></section>\n';
  md.renderer.rules.footnote_open = (tokens, i) => `<li id="${anchor(tokens[i].meta)}">`;
  md.renderer.rules.footnote_anchor = (tokens, i) => ` <a href="#${reference(tokens[i].meta)}" role="doc-backlink" aria-label="${ja ? '本文へ戻る' : 'Back to reference'} ${tokens[i].meta.id + 1}">↩</a>`;

  // Work on parsed block tokens: nested lists, fenced code and ordinary
  // blockquotes keep Markdown's boundaries and escaping rules.
  md.core.ruler.after('inline', 'doc-ui-alerts', state => {
    const { tokens } = state;
    for (let i = 0; i < tokens.length; i++) {
      const open = tokens[i];
      const inline = tokens[i + 2];
      if (open.type !== 'blockquote_open' || tokens[i + 1]?.type !== 'paragraph_open' || inline?.type !== 'inline') continue;
      const match = inline.content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(?:\n|$)/);
      if (!match) continue;
      const close = tokens.findIndex((token, j) => j > i && token.type === 'blockquote_close' && token.level === open.level);
      if (close < 0) continue;
      const [en, jp, tone] = alerts[match[1]];
      open.tag = tokens[close].tag = 'aside';
      open.attrSet('class', `callout ${tone}`);
      inline.content = inline.content.slice(match[0].length);
      inline.children = [];
      md.inline.parse(inline.content, md, state.env, inline.children);
      const title = new state.Token('html_block', '', 0);
      title.content = `<p class="callout-title">${escape(ja ? jp : en)}</p>\n`;
      // Remove an empty marker paragraph, retaining subsequent block content.
      if (!inline.content) tokens.splice(i + 1, 3, title);
      else tokens.splice(i + 1, 0, title);
    }
  });
}
